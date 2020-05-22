import { LayaModel } from "../model/LayaModel";
export class Live2DSubmit implements laya.webgl.submit.ISubmit{
    static TYPE_LIVE2D:number = 11000;
    _model:LayaModel;
    _key:any = {};
    constructor(){
    }

    renderSubmit():number{
        this._model.update();
        return 1;
    }

    getRenderType(): number{
        return Live2DSubmit.TYPE_LIVE2D;
    }

    releaseRender(): void{
        this._model = null;
        Laya.Pool.recover("Live2DSubmit_Pool",this);
    }

    static create(model:LayaModel):Live2DSubmit{
        let o:Live2DSubmit = Laya.Pool.getItemByClass("Live2DSubmit_Pool",Live2DSubmit);
        o._model= model;
        return o;
    }
}