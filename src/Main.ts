import GameConfig from "./GameConfig";
import { Delegate } from "./live2D/core/Delegate";
import Live2DLoader from "./live2D/net/Live2DLoader";
import { LayaModel } from "./live2D/model/Live2DModel";
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
		
		let loader = new Live2DLoader();
		loader.loadAssets("res/Hiyori","Hiyori.model3.json",Laya.Handler.create(this,this._loadSuccess));
		//激活资源版本控制，version.json由IDE发布功能自动生成，如果没有也不影响后续流程
		
		// Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);
	}

	private _loadSuccess(model:LayaModel){
		model.initModel();
		Laya.stage.addChild(model);
		Laya.loader.load(["res/atlas/comp.atlas","res/atlas/test.atlas"],Laya.Handler.create(this,()=>{
			Laya.stage.addChild(new GameUI());
		}));
		//缩放下
		model.scale(0.1,0.1);
		model.on(Laya.Event.MOUSE_DOWN,this,this.onMouseDown,[model])
	}

	private onMouseDown(model:LayaModel):void{
		// console.log("trueture")
		if(model.live2DHitTest("Body",Laya.MouseManager.instance.mouseX ,Laya.MouseManager.instance.mouseY)){
			// console.log("点击到了Body");
			model.setRandomExpression();
		};
	}
	
}
//激活启动类
new Main();
