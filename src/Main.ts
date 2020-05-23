import GameConfig from "./GameConfig";
import { Delegate } from "./live2D/core/Delegate";
import Live2DLoader from "./live2D/net/Live2DLoader";
import { Live2DModel } from "./live2D/model/Live2DModel";
import { Live2DCubismFramework as Live2Drenderer } from "./live2D/render/Live2Drenderer";
import CubismShader_WebGL = Live2Drenderer.CubismShader_WebGL;
import GameUI from "./script/GameUI";


class Main {
	private _model:Live2DModel;
	private _modelurls = [
		"Haru","Hiyori","Mark","Natori","Rice"
	];
	private 
	private index:number = 0;
	constructor() {
		Laya.init(GameConfig.width,GameConfig.height, Laya["WebGL"]);
		Laya["Physics"] && Laya["Physics"].enable();
		Laya["DebugPanel"] && Laya["DebugPanel"].enable();
		Laya.stage.scaleMode = GameConfig.scaleMode;
		Laya.stage.screenMode = Laya.Stage.SCREEN_HORIZONTAL;
		Laya.stage.alignV = GameConfig.alignV;
		Laya.stage.alignH = GameConfig.alignH;
		//兼容微信不支持加载scene后缀场景
		Laya.URL.exportSceneToJson = GameConfig.exportSceneToJson;
		//打开调试面板（通过IDE设置调试模式，或者url地址增加debug=true参数，均可打开调试面板）
		if (GameConfig.debug || Laya.Utils.getQueryString("debug") == "true") Laya.enableDebugPanel();
		if (GameConfig.physicsDebug && Laya["PhysicsDebugDraw"]) Laya["PhysicsDebugDraw"].enable();
		if (GameConfig.stat) Laya.Stat.show();
		Laya.alertGlobalError(true);
		Laya.Browser.onMiniGame&&(Laya.URL.basePath = "https://10.10.82.100:9001/")
		//初始化渲染gl相关
		CubismShader_WebGL.__init__();
		//编译live2dshader
		CubismShader_WebGL.getInstance().generateShaders();
		//初始化live2d计时
		Delegate.instance.initializeCubism();
		//激活资源版本控制，version.json由IDE发布功能自动生成，如果没有也不影响后续流程
		this.initRedBtn();
		// Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);
	}
	private changeModel(){
		// console.log("red down");
		if (this._model) {
			this._model.destroy();
		}
		this._model = null;
		let loader = new Live2DLoader();
		let url = this._modelurls[this.index % this._modelurls.length];
		this.index ++;
		loader.loadAssets("res/"+url,url+".model3.json",Laya.Handler.create(this,this._loadSuccess));
	}

	private _loadSuccess(model:Live2DModel,loader:Live2DLoader){
		this._model = model;
		model.initModel();
		Laya.stage.addChild(model);
		model.scale(0.1,0.1);
		loader.clear()
		model.on(Laya.Event.MOUSE_DOWN,this,this.onMouseDown);
		model.on(Laya.Event.CHANGE,this,this.aboutEvent);
		Laya.stage.on(Laya.Event.MOUSE_DOWN,this,this.stageOnMouseDown);
		
	}

	private initRedBtn(){
		let sp = new Laya.Sprite();
		Laya.stage.addChild(sp)
		sp.graphics.drawRect(0,0,100 ,100,"red");
		sp.mouseEnabled = true;
		sp.mouseThrough =true
		sp.x = Laya.stage.width - 100;
		sp.on(Laya.Event.MOUSE_DOWN,this,this.changeModel)
	}

	
	private aboutEvent(eventValue):void{
		console.log(eventValue);
	}
	private stageOnMouseDown():void{
		Laya.stage.on(Laya.Event.MOUSE_MOVE,this,this.onMouseMove)
		Laya.stage.on(Laya.Event.MOUSE_OUT,this,this.onMouseUp)
		Laya.stage.on(Laya.Event.MOUSE_UP,this,this.onMouseUp)
	}
	private onMouseDown():void{
		if (!this._model) {
			return
		}
		let model = this._model;
		// console.log("trueture")
		if(model.live2DHitTest("Body",Laya.MouseManager.instance.mouseX ,Laya.MouseManager.instance.mouseY)){
			console.log("点击到了Body");
			// model.setRandomExpression();
			model.startRandomMotion("TapBody",3);
		};
		
	}

	private onMouseUp(){
		Laya.stage.off(Laya.Event.MOUSE_MOVE,this,this.onMouseMove)
		Laya.stage.off(Laya.Event.MOUSE_OUT,this,this.onMouseUp)
		Laya.stage.off(Laya.Event.MOUSE_UP,this,this.onMouseUp)
	}

	private onMouseMove(){
		if (!this._model) {
			return
		}
		this._model.setDragging(Laya.MouseManager.instance.mouseX,Laya.MouseManager.instance.mouseY)
	}
	
}
//激活启动类
new Main();
