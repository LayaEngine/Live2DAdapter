import GameConfig from "./GameConfig";
import { Delegate } from "./live2D/core/Delegate";
import Live2DLoader from "./live2D/net/Live2DLoader";
import { Live2DModel } from "./live2D/model/Live2DModel";
import { Live2DCubismFramework as Live2Drenderer } from "./live2D/render/Live2Drenderer";
import { Live2DCubismFramework as cubismphysics } from "./framework/physics/cubismphysics";
import { Live2DCubismFramework as cubismvector2 } from './framework/math/cubismvector2';
import CubismVector2 = cubismvector2.CubismVector2;
import CubismShader_WebGL = Live2Drenderer.CubismShader_WebGL;
import Options = cubismphysics.Options;
import GameUI from "./script/GameUI";


class Main {
	private _model:Live2DModel;
	private _modelurls = [
		"Haru","Hiyori","Mark","Natori","Rice"
	];
	private index:number = 0;
	constructor() {
		Config.useRetinalCanvas=true;
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
		Laya.Browser.onMiniGame&&(Laya.URL.basePath = "http://10.10.20.48:8900/bin/");
		//初始化渲染gl相关
		CubismShader_WebGL.__init__();
		//编译live2dshader
		CubismShader_WebGL.getInstance().generateShaders();
		//初始化live2d计时
		Delegate.instance.initializeCubism();
		this.initRedBtn();
	}
	private changeModel(){
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
		if(!model)return;
		this._model = model;
		model.initModel();
		Laya.stage.addChild(model);
		// var sp = new Laya.Sprite();
		// sp.size(model.width/4,model.height/4);
		// model.mask = sp;

		model.scale(0.1,0.1);
		// if(model.physics){
		// 	let op =new Options();
		// 	op.wind = new CubismVector2(0.1,0.1);
		// 	model.physics.setOptions(op)
		// }
		//清理loader数据
		(window as any).model = model; 
		model.renderer.setCutRectMaxXY(0,0)
		loader.clear();
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
		if(model.live2DHitTest("Body",Laya.MouseManager.instance.mouseX ,Laya.MouseManager.instance.mouseY)){
			// console.log("点击到了Body");
			// model.setRandomExpression();
			// model.startMotionByName("Idle","haru_g_idle",3);
			model.startRandomMotion("TapBody",3);
		}else
		if (model.live2DHitTest("Head",Laya.MouseManager.instance.mouseX ,Laya.MouseManager.instance.mouseY) ){
			console.log("点到Head了")
			model.startRandomMotion("Idle",3);
		}
		
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
