import GameConfig from "./GameConfig";
import { Delegate } from "./live2D/core/Delegate";
import Live2DLoader from "./live2D/net/Live2DLoader";
import { LayaModel } from "./live2D/model/LayaModel";
import { Live2DCubismFramework as Live2Drenderer } from "./live2D/render/Live2Drenderer";
import CubismShader_WebGL = Live2Drenderer.CubismShader_WebGL;


class Main {
	constructor() {
		//根据IDE设置初始化引擎		
		if (window["Laya3D"]) Laya3D.init(GameConfig.width, GameConfig.height);
		else Laya.init(GameConfig.width, GameConfig.height, Laya["WebGL"]);
		Laya["Physics"] && Laya["Physics"].enable();
		Laya["DebugPanel"] && Laya["DebugPanel"].enable();
		Laya.stage.scaleMode = GameConfig.scaleMode;
		Laya.stage.screenMode = GameConfig.screenMode;
		Laya.stage.alignV = GameConfig.alignV;
		Laya.stage.alignH = GameConfig.alignH;
		//兼容微信不支持加载scene后缀场景
		Laya.URL.exportSceneToJson = GameConfig.exportSceneToJson;
		// new CubismMotionQueueManager();
		//打开调试面板（通过IDE设置调试模式，或者url地址增加debug=true参数，均可打开调试面板）
		if (GameConfig.debug || Laya.Utils.getQueryString("debug") == "true") Laya.enableDebugPanel();
		if (GameConfig.physicsDebug && Laya["PhysicsDebugDraw"]) Laya["PhysicsDebugDraw"].enable();
		if (GameConfig.stat) Laya.Stat.show();
		Laya.alertGlobalError(true);
		CubismShader_WebGL.__init__();
		Delegate.instance.initializeCubism();
		let loader = new Live2DLoader();
		loader.loadAssets("res/Haru","Haru.model3.json",Laya.Handler.create(this,this._loadSuccess));
		// start
		//激活资源版本控制，version.json由IDE发布功能自动生成，如果没有也不影响后续流程
		// Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);
	}

	private _loadSuccess(model:LayaModel){
		Laya.stage.addChild(model);
		model.initModel();
	}
	
}
//激活启动类
new Main();
