import { LayaModel } from "../model/Live2DModel";
import { Live2DTime } from "../core/Live2DTime";
export class Live2DSubmit implements laya.webgl.submit.ISubmit{
    static TYPE_LIVE2D:number = 11000;
    private _model:LayaModel;
    _key:any = {};
    private saveParameter:any;
    constructor(){
    }
    public init(model){
        this._model = model;
        this.saveParameter = {};
        this.saveParameter.vertexs = [];
    }
    renderSubmit():number{
        Live2DTime.updateTime();
        this.start()
        this._model.update(Live2DTime.getDeltaTime());
        this.end();
        return 1;
    }

    getRenderType(): number{
        return Live2DSubmit.TYPE_LIVE2D;
    }

    releaseRender(): void{
        this._model = null;
        this.saveParameter = null;
        Laya.Pool.recover("Live2DSubmit_Pool",this);
    }

    start():void{
        let gl:WebGLRenderingContext = (Laya.WebGLContext as any).mainContext
        // debugger
        this.saveParameter.BLEND = gl.getParameter(gl.BLEND);
        this.saveParameter.CULL_FACE = gl.getParameter(gl.CULL_FACE);
        this.saveParameter.SCISSOR_TEST = gl.getParameter(gl.SCISSOR_TEST);
        this.saveParameter.STENCIL_TEST = gl.getParameter(gl.STENCIL_TEST);
        this.saveParameter.DEPTH_TEST = gl.getParameter(gl.DEPTH_TEST);
        //记录bindtexture
        this.saveParameter.bindTexture = gl.getParameter(gl.TEXTURE_BINDING_2D);
        //记录bindprogram
        this.saveParameter.program = gl.getParameter(gl.CURRENT_PROGRAM);

        this.saveParameter.frontFace = gl.getParameter(gl.FRONT_FACE);
        //记录bindbuffer
        this.saveParameter.ARRAY_BUFFER_BINDING = gl.getParameter(gl.ARRAY_BUFFER_BINDING);
        this.saveParameter.ELEMENT_ARRAY_BUFFER_BINDING = gl.getParameter(gl.ELEMENT_ARRAY_BUFFER_BINDING);
        //记录混合方式
        this.saveParameter.BLEND_DST_ALPHA = gl.getParameter(gl.BLEND_DST_ALPHA);
        this.saveParameter.BLEND_DST_RGB = gl.getParameter(gl.BLEND_DST_RGB);
        this.saveParameter.BLEND_SRC_ALPHA = gl.getParameter(gl.BLEND_SRC_ALPHA);
        this.saveParameter.BLEND_SRC_RGB = gl.getParameter(gl.BLEND_SRC_RGB);
        //记录bindframebuffer
        this.saveParameter.FRAMEBUFFER_BINDING = gl.getParameter(gl.FRAMEBUFFER_BINDING);
        //记录vertexAttribPointer

        let enable:GLboolean,data:any;
        let vertexs = this.saveParameter.vertexs
        vertexs.length = 0;
        let max = gl.getParameter(gl.MAX_VERTEX_ATTRIBS)
        for (let index = 0; index < max; index++) {
            enable = gl.getVertexAttrib(index,gl.VERTEX_ATTRIB_ARRAY_ENABLED);
            if(enable){
                data = vertexs[index] = {};
                data.index = index;
                // （index，size，type，normalized，stride，offset）
                data.buffer = gl.getVertexAttrib(index,gl.VERTEX_ATTRIB_ARRAY_BUFFER_BINDING);
                data.size = gl.getVertexAttrib(index,gl.VERTEX_ATTRIB_ARRAY_SIZE);
                data.type = gl.getVertexAttrib(index,gl.VERTEX_ATTRIB_ARRAY_TYPE);
                data.normalized = gl.getVertexAttrib(index,gl.VERTEX_ATTRIB_ARRAY_NORMALIZED);
                data.stride = gl.getVertexAttrib(index,gl.VERTEX_ATTRIB_ARRAY_STRIDE);
                data.offset = gl.getVertexAttribOffset(index,gl.VERTEX_ATTRIB_ARRAY_POINTER);
            }else
            {
                // console.log(`${index},is disable`);
                break;
            }
        }
    }

    end():void{
        let gl:WebGLRenderingContext = (Laya.WebGLContext as any).mainContext
        if(this.saveParameter.BLEND){
            gl.enable(gl.BLEND);
        }else
            gl.disable(gl.BLEND);

        if(this.saveParameter.CULL_FACE){
            gl.enable(gl.CULL_FACE);
        }else
            gl.disable(gl.CULL_FACE);

        if(this.saveParameter.SCISSOR_TEST){
            gl.enable(gl.SCISSOR_TEST);
        }

        if(this.saveParameter.STENCIL_TEST)
        {
            gl.enable(gl.STENCIL_TEST);
        }

        if(this.saveParameter.DEPTH_TEST){
            gl.enable(gl.DEPTH_TEST);
        }
        gl.bindTexture(gl.TEXTURE_2D,this.saveParameter.bindTexture);
        gl.bindFramebuffer(gl.FRAMEBUFFER,this.saveParameter.FRAMEBUFFER_BINDING);
        gl.blendFuncSeparate(this.saveParameter.BLEND_SRC_RGB,this.saveParameter.BLEND_DST_RGB,this.saveParameter.BLEND_SRC_ALPHA,this.saveParameter.BLEND_DST_ALPHA);
        gl.frontFace(this.saveParameter.frontFace);
        gl.useProgram(this.saveParameter.program);
        gl.bindBuffer(gl.ARRAY_BUFFER,this.saveParameter.ARRAY_BUFFER_BINDING);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,this.saveParameter.ELEMENT_ARRAY_BUFFER_BINDING);

        let vertexs = this.saveParameter.vertexs;
        for (let index = 0; index < vertexs.length; index++) {
            const element = vertexs[index];
            gl.bindBuffer(gl.ARRAY_BUFFER,element.buffer);
            gl.enableVertexAttribArray(element.index);
            gl.vertexAttribPointer(element.index,element.size,element.type,element.normalized,element.stride,element.offset);
        }
    }

    static create(model:LayaModel):Live2DSubmit{
        let o:Live2DSubmit = Laya.Pool.getItemByClass("Live2DSubmit_Pool",Live2DSubmit);
        o.init(model);
        return o;
    }
}