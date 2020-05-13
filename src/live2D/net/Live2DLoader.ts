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
    private _byte:Laya.Byte = new Laya.Byte();
    private _completeHandler:Laya.Handler;
    private _model:LayaModel;

    
    constructor(){
        super();
    }
    
    /**
     * 从放置model3.json的目录和文件路径生成模型
     * @param dir 
     * @param fileName 
     */
    public loadAssets(dir:string,fileName:string,complete:Laya.Handler = null):void{
        this._model = new LayaModel();
        this._modelHomeDir = dir;
        this._completeHandler = complete;
        Laya.loader.load(`${dir}/${fileName}`,Laya.Handler.create(this,this._loadAssetsComplete),null,Laya.Loader.BUFFER);
    }

    private _loadAssetsComplete(obj:any){
        this._byte.clear();
        // this._byte
        debugger
    }
    private _parseStringToBuffer(str:string):ArrayBuffer{
        return null;
    }
}