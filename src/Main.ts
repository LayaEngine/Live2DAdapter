import GameConfig from "./GameConfig";
import { Delegate } from "./live2D/core/Delegate";
import Live2DLoader from "./live2D/net/Live2DLoader";
import { Live2DModel } from "./live2D/model/Live2DModel";
import { Live2DCubismFramework as Live2Drenderer } from "./live2D/render/Live2Drenderer";
import CubismShader_WebGL = Live2Drenderer.CubismShader_WebGL;
import GameUI from "./script/GameUI";


class Main {
	constructor() {
		Laya.init(GameConfig.width,GameConfig.height, Laya["WebGL"]);
		Laya["Physics"] && Laya["Physics"].enable();
		Laya["DebugPanel"] && Laya["DebugPanel"].enable();
		Laya.stage.scaleMode = GameConfig.scaleMode;
		Laya.stage.screenMode = GameConfig.screenMode;
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
		
		// let sp = new Laya.Sprite();
		// let sp2 = new Laya.Sprite();
		// sp.size(2048,2048);
		// sp.graphics.drawRect(0,0,2048,2048,"red");
		// sp.pivotX = 1024;
		// sp.pivotY = 1024;
		// sp.scale(0.1,0.1);
		// sp.pos(102.4,102.4);
		// Laya.stage.addChild(sp);
		// sp.addChild(sp2);
		// sp2.graphics.drawRect(0,0,1024,1024,"white");
		let loader = new Live2DLoader();
		loader.loadAssets("res/Rice","Rice.model3.json",Laya.Handler.create(this,this._loadSuccess));
		//激活资源版本控制，version.json由IDE发布功能自动生成，如果没有也不影响后续流程
		
		// Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);
	}

	private _loadSuccess(model:Live2DModel){
		model.initModel();
		let sp = new Laya.Sprite();
		Laya.stage.addChild(sp)
		Laya.stage.addChild(model);
		// model.addChild(sp);
		model.scale(0.1,0.1);
		// Laya.loader.load(["res/atlas/comp.atlas","res/atlas/test.atlas"],Laya.Handler.create(this,()=>{
		// 	Laya.stage.addChild(new GameUI());
		// }));
		// 缩放下
		// sp.graphics.drawRect(0,0,model.width ,model.height,"red");
		sp.graphics.drawRect(0,0,model.width * model.scaleX ,model.height * model.scaleY,"red");
		// model.pos((model.width - model.pivotX)*model.scaleX,(model.height - model.pivotY)*model.scaleY);
		model.on(Laya.Event.MOUSE_DOWN,this,this.onMouseDown,[model]);
		model.on(Laya.Event.CHANGE,this,this.aboutEvent);
		Laya.stage.on(Laya.Event.MOUSE_DOWN,this,this.stageOnMouseDown,[model])
	}
	private aboutEvent(eventValue):void{
		console.log(eventValue);
	}
	private stageOnMouseDown(model:Live2DModel):void{
		Laya.stage.on(Laya.Event.MOUSE_MOVE,this,this.onMouseMove,[model])
		Laya.stage.on(Laya.Event.MOUSE_OUT,this,this.onMouseUp,[model])
		Laya.stage.on(Laya.Event.MOUSE_UP,this,this.onMouseUp,[model])
	}
	private onMouseDown(model:Live2DModel):void{
		// console.log("trueture")
		if(model.live2DHitTest("Body",Laya.MouseManager.instance.mouseX ,Laya.MouseManager.instance.mouseY)){
			console.log("点击到了Body");
			// model.setRandomExpression();
			model.startRandomMotion("TapBody",3);
		};
		
	}

	private onMouseUp(model:Live2DModel){
		Laya.stage.off(Laya.Event.MOUSE_MOVE,this,this.onMouseMove)
		Laya.stage.off(Laya.Event.MOUSE_OUT,this,this.onMouseUp)
		Laya.stage.off(Laya.Event.MOUSE_UP,this,this.onMouseUp)
	}

	private onMouseMove(model:Live2DModel){
		model.setDragging(Laya.MouseManager.instance.mouseX,Laya.MouseManager.instance.mouseY)
	}
	
}
//激活启动类
new Main();
