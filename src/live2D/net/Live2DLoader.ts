import { LayaModel } from "../model/LayaModel";


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
    private _model:LayaModel;
    public state:LoadStep;

    constructor(){
        super();
    }
    
    /**
     * 从放置model3.json的目录和文件路径生成模型
     * @param dir 
     * @param fileName 
     */
    public loadAssets(dir:string,fileName:string,complete:Laya.Handler = null):void{
        this._model =  new LayaModel();
        this._model._modelHomeDir = this._modelHomeDir = dir;
        this._completeHandler = complete;
        Laya.loader.load(`${dir}/${fileName}`,Laya.Handler.create(this,this._loadAssetsComplete),null,Laya.Loader.BUFFER);
    }

    private _loadAssetsComplete(buffer:ArrayBuffer){
        this._model.createSetting(buffer);
        this.state = LoadStep.LoadModel;
        this.setupModel();
    }
    
    /**
     * 从model3.json生成模型。
     * 根据model3.json的描述生成模型，运动和物理等组件。
     */
    private setupModel(){
        let modelFileName = this._model.setting.getModelFileName();
        if (modelFileName!='') {
            this.state = LoadStep.WaitLoadModel;
            // this._model._urls.push(`${this._modelHomeDir}/${modelFileName}`);
            Laya.loader.load(`${this._modelHomeDir}/${modelFileName}`,Laya.Handler.create(this,this._setupModelComplete),null,Laya.Loader.BUFFER);
        }else{
            console.warn('Model data does not exist.');
        }
    }

    private _setupModelComplete(buffer:ArrayBuffer):void{
        this._model.loadModel(buffer);
        this.state = LoadStep.LoadExpression;
        this.loadCubismExpression();
    }

    private loadCubismExpression():void{
        let expressionCount:number = this._model.setting.getExpressionCount();
        if (expressionCount>0) {
            this._model._expressionUrls = [];
            this._model._expressionNames = [];
            for (let i = 0; i < expressionCount; i++) {
                this._model._expressionNames.push(
                    this._model.setting.getExpressionName(i)
                );
                this._model._expressionUrls.push(
                    `${this._modelHomeDir}/${this._model.setting.getExpressionFileName(i)}`
                );
            }
            this.state = LoadStep.WaitLoadExpression;
            Laya.loader.load(this._model._expressionUrls.slice(),Laya.Handler.create(this,this._loadCubismExpressionComplete,[expressionCount]),null,Laya.Loader.BUFFER);
        } else {
            this.state = LoadStep.LoadPhysics;
            this.loadCubismPhysics();
        }
    }

    private _loadCubismExpressionComplete(count:number):void{
        for (let i = 0; i < count; i++) {
            let buffer:ArrayBuffer = Laya.loader.getRes(this._model._expressionUrls[i]);
            this._model.loadExpression(buffer,buffer.byteLength,this._model._expressionNames[i]);
        }
        this.state = LoadStep.LoadPhysics;
        this.loadCubismPhysics();
    }

    /**
     * 加载物理
     */
    private loadCubismPhysics():void {
        let physicsFileName:string =this._model.setting.getPhysicsFileName();
        if (physicsFileName != '') {
            this.state = LoadStep.WaitLoadPhysics;
            Laya.loader.load(`${this._modelHomeDir}/${physicsFileName}`,Laya.Handler.create(this,this._loadCubismPhysicsComplete),null,Laya.Loader.BUFFER);
        } else {
            this.state = LoadStep.LoadPose;
            this.loadCubismPose();
        }
    }

    private _loadCubismPhysicsComplete(buffer:ArrayBuffer):void{
        this._model.loadPhysics(buffer,buffer.byteLength);
        this.state = LoadStep.LoadPose;
        this.loadCubismPose();
    }
    /**
     * Pose
     */
    private loadCubismPose():void{
        let poseFileName = this._model.setting.getPoseFileName();
        if (poseFileName != '') {
            this.state = LoadStep.WaitLoadPose;
            Laya.loader.load(`${this._modelHomeDir}/${poseFileName}`,Laya.Handler.create(this,this._loadCubismPoseComplete),null,Laya.Loader.BUFFER);
          } else {
            this.state = LoadStep.SetupEyeBlink;
            this.detailsinit();
          }
    }

    private _loadCubismPoseComplete(buffer:ArrayBuffer):void{
        this._model.loadPose(buffer,buffer.byteLength);
        this.state = LoadStep.SetupEyeBlink;
        this.detailsinit();
    }

    private detailsinit():void{
        this._model.setupEyeBlink();
        this.state = LoadStep.SetupBreath;
        this._model.setupBreath();
        this.state = LoadStep.LoadUserData;
        let userDataFile = this._model.setting.getUserDataFile();
        if (userDataFile != '') {
            this.state = LoadStep.WaitLoadUserData;
            Laya.loader.load(`${this._modelHomeDir}/${userDataFile}`,Laya.Handler.create(this,this._loadUserDataComplete),null,Laya.Loader.BUFFER);
          } else {
            this.state = LoadStep.SetupEyeBlinkIds;
            this.detailsinit2();
          }
    }

    private _loadUserDataComplete(buffer:ArrayBuffer):void{
        this._model.loadUserData(buffer,buffer.byteLength);
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
            this._model.preMotionUrls();
            this.state = LoadStep.LoadMotion;
            Laya.loader.load(this._model._motionUrls.slice(),Laya.Handler.create(this,this._preLoadMotionGroupComplete));
        }else{
            this.state = LoadStep.LoadTexture;
            this.loadTexture();
        }
    }

    private _preLoadMotionGroupComplete():void{
        this._model.loadMotionGroup()
        this.state = LoadStep.LoadTexture;
        this.loadTexture();
    }

    private loadTexture():void
    {
        if (this.state !== LoadStep.LoadTexture) {
            return;
        }
        let textureCount: number = this._model.setting.getTextureCount();
        this._model._textureUrls=[];
        let texturePath;
        for(let i = 0;i<textureCount;i++){
            texturePath = `${this._modelHomeDir}/${this._model.setting.getTextureFileName(i)}`;
            this._model._textureUrls.push({url:texturePath,type:"nativeimage"});
        }
        Laya.loader.load(this._model._textureUrls.slice(),Laya.Handler.create(this,this.loadComplete))
    }
    /**
     * 整体加载完成
     */
    private loadComplete():void{
        this.state = LoadStep.CompleteSetup;
        this._completeHandler && this._completeHandler.runWith([this._model]);
    }
    /**
     * 清理数据
     */
    public clear():void{
        this._modelHomeDir = null
        this._model = null;
        this.state = LoadStep.LoadAssets;
    }
}