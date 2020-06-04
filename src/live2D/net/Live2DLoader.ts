import { Live2DModel } from "../model/Live2DModel";
import { Live2DCubismFramework as cubismmodelsettingjson } from '../../framework/cubismmodelsettingjson';
import CubismModelSettingJson = cubismmodelsettingjson.CubismModelSettingJson;


export enum LoadStep {
    LoadAssets,
    LoadModel,
    WaitLoadModel,
    LoadExpression,
    WaitLoadExpression,
    LoadPhysics,
    WaitLoadPhysics,
    LoadPose,
    WaitLoadPose,
    SetupEyeBlink,
    SetupBreath,
    LoadUserData,
    WaitLoadUserData,
    SetupEyeBlinkIds,
    SetupLipSyncIds,
    SetupLayout,
    LoadMotion,
    WaitLoadMotion,
    CompleteInitialize,
    CompleteSetupModel,
    LoadTexture,
    WaitLoadTexture,
    CompleteSetup
}

export default class Live2DLoader extends Laya.EventDispatcher{
    private _modelHomeDir:string;
    private _completeHandler:Laya.Handler;
    private _model:Live2DModel;
    public state:LoadStep;
    private _setting:CubismModelSettingJson;
    /**读取的所有的Json数据 */
    public jsonUrls:Array<string>;
    constructor(){
        super();
        this.jsonUrls=[];
    }
    
    /**
     * 从放置model3.json的目录和文件路径生成模型
     * @param dir 
     * @param fileName 
     */
    public loadAssets(dir:string,fileName:string,complete:Laya.Handler = null):void{
        this._model =  new Live2DModel();
        this._model._modelHomeDir = this._modelHomeDir = dir;
        this._completeHandler = complete;
        let url = `${dir}/${fileName}`;
        this.jsonUrls.push(url);
        Laya.loader.load(url,Laya.Handler.create(this,this._loadAssetsComplete),null,Laya.Loader.BUFFER);
    }

    private _loadAssetsComplete(buffer:ArrayBuffer){
        if(!buffer){
            console.error("loadAssets fail!");
            this._completeHandler&&this._completeHandler.run();
            return;
        }
        this._model.createSetting(buffer);
        this._setting = this._model.setting;
        this.state = LoadStep.LoadModel;
        this.setupModel();
    }
    
    /**
     * 从model3.json生成模型。
     * 根据model3.json的描述生成模型，运动和物理等组件。
     */
    private setupModel(){
        let modelFileName = this._setting.getModelFileName();
        if (modelFileName!='') {
            this.state = LoadStep.WaitLoadModel;
            let url = `${this._modelHomeDir}/${modelFileName}`;
            this.jsonUrls.push(url);
            Laya.loader.load(url,Laya.Handler.create(this,this._setupModelComplete),null,Laya.Loader.BUFFER);
        }else{
            console.warn('Model data does not exist.');
        }
    }

    private _setupModelComplete(buffer:ArrayBuffer):void{
        if(!buffer){
            console.error("loadModel fail!");
            this._completeHandler&&this._completeHandler.run();
            return;
        }
        this._model.loadModel(buffer);
        this.state = LoadStep.LoadExpression;
        this.loadCubismExpression();
    }

    private loadCubismExpression():void{
        let expressionCount:number = this._setting.getExpressionCount();
        if (expressionCount>0) {
            this._model._expressionUrls = [];
            this._model._expressionNames = [];
            let url:string;
            for (let i = 0; i < expressionCount; i++) {
                this._model._expressionNames.push(
                    this._setting.getExpressionName(i)
                );
                url = `${this._modelHomeDir}/${this._setting.getExpressionFileName(i)}`;
                this.jsonUrls.push(url);
                this._model._expressionUrls.push(
                    url
                );
            }
            this.state = LoadStep.WaitLoadExpression;
            Laya.loader.load(this._model._expressionUrls,Laya.Handler.create(this,this._loadCubismExpressionComplete,[expressionCount]),null,Laya.Loader.BUFFER);
        } else {
            this.state = LoadStep.LoadPhysics;
            this.loadCubismPhysics();
        }
    }

    private _loadCubismExpressionComplete(count:number):void{
        for (let i = 0; i < count; i++) {
            let buffer:ArrayBuffer = Laya.loader.getRes(this._model._expressionUrls[i]);
            if(!buffer){
                console.log(`[WARNNING]:${this._model._expressionUrls[i]} data load fail!`);
            }else
                this._model.loadExpression(buffer,buffer.byteLength,this._model._expressionNames[i]);
        }
        this._model._expressionUrls = null;
        this.state = LoadStep.LoadPhysics;
        this.loadCubismPhysics();
    }

    /**
     * 加载物理
     */
    private loadCubismPhysics():void {
        let physicsFileName:string =this._setting.getPhysicsFileName();
        if (physicsFileName != '') {
            this.state = LoadStep.WaitLoadPhysics;
            let url = `${this._modelHomeDir}/${physicsFileName}`;
            this.jsonUrls.push(url);
            Laya.loader.load(url,Laya.Handler.create(this,this._loadCubismPhysicsComplete),null,Laya.Loader.BUFFER);
        } else {
            this.state = LoadStep.LoadPose;
            this.loadCubismPose();
        }
    }

    private _loadCubismPhysicsComplete(buffer:ArrayBuffer):void{
        if(!buffer){
            console.log("[WARNNING]:Physics data load fail!");
        }else{
            this._model.loadPhysics(buffer,buffer.byteLength);
        }
        this.state = LoadStep.LoadPose;
        this.loadCubismPose();
    }
    /**
     * Pose
     */
    private loadCubismPose():void{
        let poseFileName = this._setting.getPoseFileName();
        if (poseFileName != '') {
            this.state = LoadStep.WaitLoadPose;
            let url = `${this._modelHomeDir}/${poseFileName}`;
            this.jsonUrls.push(url);
            Laya.loader.load(url,Laya.Handler.create(this,this._loadCubismPoseComplete),null,Laya.Loader.BUFFER);
          } else {
            this.state = LoadStep.SetupEyeBlink;
            this.detailsinit();
          }
    }

    private _loadCubismPoseComplete(buffer:ArrayBuffer):void{
        if(!buffer){
            console.log("[WARNNING]:Pose data load fail!");
        }else
            this._model.loadPose(buffer,buffer.byteLength);
        this.state = LoadStep.SetupEyeBlink;
        this.detailsinit();
    }

    private detailsinit():void{
        this._model.setupEyeBlink();
        this.state = LoadStep.SetupBreath;
        this._model.setupBreath();
        this.state = LoadStep.LoadUserData;
        let userDataFile = this._setting.getUserDataFile();
        if (userDataFile != '') {
            this.state = LoadStep.WaitLoadUserData;
            let url = `${this._modelHomeDir}/${userDataFile}`;
            this.jsonUrls.push(url);
            Laya.loader.load(url,Laya.Handler.create(this,this._loadUserDataComplete),null,Laya.Loader.BUFFER);
          } else {
            this.state = LoadStep.SetupEyeBlinkIds;
            this.detailsinit2();
          }
    }

    private _loadUserDataComplete(buffer:ArrayBuffer):void{
        if(!buffer){
            console.log("[WARNNING]:UserData load fail!");
        }else{
            this._model.loadUserData(buffer,buffer.byteLength);
        }
        this.state = LoadStep.SetupEyeBlinkIds;
        this.detailsinit2();
    }

    /**
     * 第二部分无加载初始化
     */
    private detailsinit2():void{
        this._model.setupEyeBlinkIds()
        this.state = LoadStep.SetupLipSyncIds;
        this._model.setupLipSyncIds();
        this.state = LoadStep.SetupLayout;
        this._model.setupLayout();
        this.state = LoadStep.WaitLoadMotion;
        this._model.loadCubismMotion();
        if (this._model.allMotionCount) {
            this.preMotionUrls();
            this.state = LoadStep.LoadMotion;
            Laya.loader.load(this._model._motionUrls,Laya.Handler.create(this,this._preLoadMotionGroupComplete));
        }else{
            this.state = LoadStep.LoadTexture;
            this.loadTexture();
        }
    }

    /**
     * 准备motion路径Urls
     */
    public preMotionUrls():void{
        this._model._motionUrls = [];
        let motionGroups = this._model._motionGroups;
        let group:string,count:number,motionFileName:string;
        for (let i = 0; i < motionGroups.length; i++) {
            group = motionGroups[i];
            count = this._setting.getMotionCount(group)
            for (let j = 0; j < count; j++) {
              motionFileName = `${this._modelHomeDir}/${this._setting.getMotionFileName(group, j)}`;
              this.jsonUrls.push(motionFileName);
              this._model._motionUrls.push({
                url:motionFileName,
                key:group,
                index:j,
                name:`${group}_${j}`,
                type:Laya.Loader.BUFFER
              });
            }
        }
    }

    private _preLoadMotionGroupComplete():void{
        this._model.loadMotionGroup();
        this._model._motionUrls = null;
        this.state = LoadStep.LoadTexture;
        this.loadTexture();
    }

    private loadTexture():void
    {
        if (this.state !== LoadStep.LoadTexture) {
            return;
        }
        let textureCount: number = this._setting.getTextureCount();
        this._model._textureUrls=[];
        let texturePath;
        for(let i = 0;i<textureCount;i++){
            texturePath = `${this._modelHomeDir}/${this._setting.getTextureFileName(i)}`;
            this._model._textureUrls.push({url:texturePath,type:"nativeimage"});
        }
        Laya.loader.load(this._model._textureUrls.slice(),Laya.Handler.create(this,this.loadComplete))
    }
    /**
     * 整体加载完成
     */
    private loadComplete():void{
        this.state = LoadStep.CompleteSetup;
        this._completeHandler && this._completeHandler.runWith([this._model,this]);
    }
    
    /**
     * 清理数据
     * @param clearJson 是否清理所有加载的json
     * @default true
     */
    public clear(clearJson:boolean = true):void{
        this._modelHomeDir = null
        this._setting =null;
        this._model = null;
        if (clearJson) {
            for (let index = 0; index < this.jsonUrls.length; index++) {
                let url = this.jsonUrls[index];
                Laya.loader.clearRes(url);
            }
        }
        this.jsonUrls.length = 0;;
        this.state = LoadStep.LoadAssets;
    }
}