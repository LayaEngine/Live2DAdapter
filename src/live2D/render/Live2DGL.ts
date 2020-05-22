export class Live2DGL {
    /**
     * @private
     */
    private _gl:WebGLRenderingContext;
     FRAMEBUFFER:GLenum;
     COLOR_ATTACHMENT0:GLenum;
     COLOR_BUFFER_BIT:GLenum;
     LINEAR:GLenum;
     TEXTURE_2D:GLenum;
     TEXTURE_MAG_FILTER:GLenum;
     TEXTURE_WRAP_T:GLenum;
     CLAMP_TO_EDGE:GLenum;
     UNSIGNED_BYTE:GLenum;
     RGBA:GLenum;
     TEXTURE_WRAP_S:GLenum;
     TEXTURE_MIN_FILTER:GLenum;
     TEXTURE0:GLenum;
     CULL_FACE:GLenum;
     CCW:GLenum;
     FRAMEBUFFER_BINDING:GLenum;
     DYNAMIC_DRAW:GLenum;
     DST_COLOR:GLenum;
     ONE_MINUS_SRC_ALPHA:GLenum;
     ZERO:GLenum;
     ONE:GLenum;
     FLOAT:GLenum;
     ARRAY_BUFFER:GLenum;
     FRAGMENT_SHADER:GLenum;
     VERTEX_SHADER:GLenum;
     LINK_STATUS:GLenum;
     ELEMENT_ARRAY_BUFFER:GLenum;
     TEXTURE1:GLenum;
     ONE_MINUS_SRC_COLOR:GLenum;
     SCISSOR_TEST:GLenum;
     STENCIL_TEST:GLenum;
     DEPTH_TEST:GLenum;
     CW:GLenum;
     BLEND:GLenum;
     COMPILE_STATUS:GLenum;
     TRIANGLES:GLenum;
     UNSIGNED_SHORT:GLenum;

    constructor(gl:WebGLRenderingContext) {
        this.saveParameter = {};
        this._gl = gl;
        this.FRAMEBUFFER = this._gl.FRAMEBUFFER;
        this.COLOR_ATTACHMENT0 = this._gl.COLOR_ATTACHMENT0;
        this.COLOR_BUFFER_BIT = this._gl.COLOR_BUFFER_BIT;
        this.LINEAR = this._gl.LINEAR;
        this.TEXTURE_2D = this._gl.TEXTURE_2D;
        this.TEXTURE_MAG_FILTER = this._gl.TEXTURE_MAG_FILTER;
        this.TEXTURE_WRAP_T = this._gl.TEXTURE_WRAP_T;
        this.TEXTURE_WRAP_S = this._gl.TEXTURE_WRAP_S;
        this.CLAMP_TO_EDGE = this._gl.CLAMP_TO_EDGE;
        this.UNSIGNED_BYTE = this._gl.UNSIGNED_BYTE;
        this.RGBA = this._gl.RGBA;
        this.TEXTURE_MIN_FILTER = this._gl.TEXTURE_MIN_FILTER;
        this.TEXTURE0 = this._gl.TEXTURE0;
        this.CULL_FACE = this._gl.CULL_FACE;
        this.CCW = this._gl.CCW;
        this.FRAMEBUFFER_BINDING = this._gl.FRAMEBUFFER_BINDING;
        this.DYNAMIC_DRAW = this._gl.DYNAMIC_DRAW;
        this.DST_COLOR = this._gl.DST_COLOR;
        this.ONE_MINUS_SRC_ALPHA = this._gl.ONE_MINUS_SRC_ALPHA;
        this.ZERO = this._gl.ZERO;
        this.ONE = this._gl.ONE;
        this.FLOAT = this._gl.FLOAT;
        this.ARRAY_BUFFER = this._gl.ARRAY_BUFFER;
        this.FRAGMENT_SHADER = this._gl.FRAGMENT_SHADER;
        this.VERTEX_SHADER = this._gl.VERTEX_SHADER;
        this.LINK_STATUS = this._gl.LINK_STATUS;
        this.ELEMENT_ARRAY_BUFFER = this._gl.ELEMENT_ARRAY_BUFFER;
        this.TEXTURE1 = this._gl.TEXTURE1;
        this.ONE_MINUS_SRC_COLOR = this._gl.ONE_MINUS_SRC_COLOR;
        this.SCISSOR_TEST = this._gl.SCISSOR_TEST
        this.STENCIL_TEST = this._gl.STENCIL_TEST;
        this.DEPTH_TEST = this._gl.DEPTH_TEST;
        this.CW = this._gl.CW;
        this.BLEND = this._gl.BLEND;
        this.COMPILE_STATUS = this._gl.COMPILE_STATUS;
        this.TRIANGLES = this._gl.TRIANGLES;
        this.UNSIGNED_SHORT = this._gl.UNSIGNED_SHORT;
    }

    private saveParameter:any;
    start():void{
        // debugger
        this.saveParameter.BLEND = this._gl.getParameter(this._gl.BLEND);
        this.saveParameter.CULL_FACE = this._gl.getParameter(this._gl.CULL_FACE);
        this.saveParameter.SCISSOR_TEST = this._gl.getParameter(this._gl.SCISSOR_TEST);
        this.saveParameter.STENCIL_TEST = this._gl.getParameter(this._gl.STENCIL_TEST);
        this.saveParameter.DEPTH_TEST = this._gl.getParameter(this._gl.DEPTH_TEST);
        //记录bindtexture
        this.saveParameter.bindTexture = this._gl.getParameter(this._gl.TEXTURE_BINDING_2D);
        //记录bindprogram
        this.saveParameter.program = this._gl.getParameter(this._gl.CURRENT_PROGRAM);

        this.saveParameter.frontFace = this._gl.getParameter(this._gl.FRONT_FACE);
        //记录bindbuffer
        this.saveParameter.ARRAY_BUFFER_BINDING = this._gl.getParameter(this._gl.ARRAY_BUFFER_BINDING);
        this.saveParameter.ELEMENT_ARRAY_BUFFER_BINDING = this._gl.getParameter(this._gl.ELEMENT_ARRAY_BUFFER_BINDING);
        //记录混合方式
        this.saveParameter.BLEND_DST_ALPHA = this._gl.getParameter(this._gl.BLEND_DST_ALPHA);
        this.saveParameter.BLEND_DST_RGB = this._gl.getParameter(this._gl.BLEND_DST_RGB);
        this.saveParameter.BLEND_SRC_ALPHA = this._gl.getParameter(this._gl.BLEND_SRC_ALPHA);
        this.saveParameter.BLEND_SRC_RGB = this._gl.getParameter(this._gl.BLEND_SRC_RGB);
        //记录bindframebuffer
        this.saveParameter.FRAMEBUFFER_BINDING = this._gl.getParameter(this._gl.FRAMEBUFFER_BINDING);
        //记录vertexAttribPointer
        // this._gl.getVertexAttrib()
        
    }

    end():void{
        if(this.saveParameter.BLEND){
            this._gl.enable(this._gl.BLEND);
        }else
            this._gl.disable(this._gl.BLEND);

        if(this.saveParameter.CULL_FACE){
            this._gl.enable(this._gl.CULL_FACE);
        }else
            this._gl.disable(this._gl.CULL_FACE);

        if(this.saveParameter.SCISSOR_TEST){
            this._gl.enable(this._gl.SCISSOR_TEST);
        }

        if(this.saveParameter.STENCIL_TEST)
        {
            this._gl.enable(this._gl.STENCIL_TEST);
        }

        if(this.saveParameter.DEPTH_TEST){
            this._gl.enable(this._gl.DEPTH_TEST);
        }
        this._gl.bindTexture(this._gl.TEXTURE_2D,this.saveParameter.bindTexture);
        this._gl.bindFramebuffer(this._gl.FRAMEBUFFER,this.saveParameter.FRAMEBUFFER_BINDING);
        this._gl.blendFuncSeparate(this.saveParameter.BLEND_SRC_RGB,this.saveParameter.BLEND_DST_RGB,this.saveParameter.BLEND_SRC_ALPHA,this.saveParameter.BLEND_DST_ALPHA);
        this._gl.frontFace(this.saveParameter.frontFace);
        this._gl.useProgram(this.saveParameter.program);
        this._gl.bindBuffer(this._gl.ARRAY_BUFFER,this.saveParameter.ARRAY_BUFFER_BINDING);
        this._gl.bindBuffer(this._gl.ELEMENT_ARRAY_BUFFER,this.saveParameter.ELEMENT_ARRAY_BUFFER_BINDING);
    }

    blendFuncSeparate(srcRGB: GLenum, dstRGB: GLenum, srcAlpha: GLenum, dstAlpha: GLenum):void{
        this._gl.blendFuncSeparate(srcRGB, dstRGB, srcAlpha, dstAlpha);
    }

    createProgram():WebGLProgram | null{
        return this._gl.createProgram();
    }

    getProgramParameter(program: WebGLProgram, pname: GLenum): any{
        return this._gl.getProgramParameter(program,pname);
    }

    //mark
    vertexAttribPointer(index: GLuint, size: GLint, type: GLenum, normalized: GLboolean, stride: GLsizei, offset: GLintptr):void{
       this._gl.vertexAttribPointer(index, size, type, normalized, stride, offset); 
    }

    //mark
    enableVertexAttribArray(index: GLuint):void{
        this._gl.enableVertexAttribArray(index);
    }

    bufferData(target: GLenum, type: any, usage: GLenum):void{
        this._gl.bufferData(target,type,usage);
    }
    
    uniformMatrix4fv(location: WebGLUniformLocation | null, transpose: GLboolean, value: Iterable<GLfloat>):void{
        this._gl.uniformMatrix4fv(location, transpose, value);
    }

    createFramebuffer():WebGLFramebuffer{
        return this._gl.createFramebuffer();
    }

    getParameter(target: GLenum):any{
        this._gl.getParameter(target);
    }

    bindFramebuffer(target: GLenum,buffer:WebGLFramebuffer|null):void{
        this._gl.bindFramebuffer(target,buffer);
    }

    createBuffer():WebGLBuffer | null{
      return this._gl.createBuffer();
    }

    clearColor(red: GLclampf, green: GLclampf, blue: GLclampf, alpha: GLclampf):void{
        this._gl.clearColor(red,green,blue,alpha);
    }

    framebufferTexture2D(target: GLenum, attachment: GLenum, textarget: GLenum, texture: WebGLTexture | null, level: GLint){
        this._gl.framebufferTexture2D(target, attachment, textarget, texture, level);
    }
    
    viewport(x: GLint, y: GLint, width: GLsizei, height: GLsizei){
        this._gl.viewport(x,y,width,height);
    }

    clear(mask:GLbitfield):void{
        this._gl.clear(mask);
    }

    bindTexture(target: GLenum, texture: WebGLTexture | null){
        this._gl.bindTexture(target,texture);
    }

    deleteTexture(texture:WebGLTexture):void{
        this._gl.deleteTexture(texture);
    }

    texParameteri(target: GLenum, pname: GLenum, param: GLint){
        this._gl.texParameteri(target, pname, param);
    }

    texImage2D(...a): void{
        if(arguments.length == 6){
            this._gl.texImage2D(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4],arguments[5]);
        }else
            this._gl.texImage2D(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4],arguments[5],arguments[6],arguments[7],arguments[8]);
    }
   
    createTexture():WebGLTexture{
       return this._gl.createTexture();
    }

    deleteFramebuffer(buffer:WebGLBuffer):void{
        this._gl.deleteBuffer(buffer);
    }

    bindBuffer(target: GLenum, buffer: WebGLBuffer | null):void{
        this._gl.bindBuffer(target, buffer);
    }

    activeTexture(texture:GLenum):void{
        this._gl.activeTexture(texture);
    }

    uniform1i(location: WebGLUniformLocation | null, x: GLint):void{
        this._gl.uniform1i(location , x);
    }

    uniform4f(location: WebGLUniformLocation | null, x: GLfloat, y: GLfloat, z: GLfloat, w: GLfloat):void{
        this._gl.uniform4f(location, x, y, z, w);
    }

    getAttribLocation(program: WebGLProgram, name: string):GLint{
        return this._gl.getAttribLocation(program,name);
    }

    getUniformLocation(program: WebGLProgram, name: string): WebGLUniformLocation | null{
        return this._gl.getUniformLocation(program,name);
    }

    deleteShader(shader:WebGLShader|null):void{
        this._gl.deleteShader(shader);
    }

    deleteProgram(program: WebGLProgram | null):void{
        this._gl.deleteProgram(program);
    }

    attachShader(program: WebGLProgram, shader: WebGLShader):void{
        this._gl.attachShader(program, shader);
    }

    linkProgram(program: WebGLProgram):void{
        this._gl.linkProgram(program);
    }

    useProgram(program: WebGLProgram | null):void{
        this._gl.useProgram(program);
    }

    //mark TODO
    disable(cap: GLenum):void{
        this._gl.disable(cap);
    }

    frontFace(mode: GLenum){
        this._gl.frontFace(mode);
    }
    
    //mark TODO
    enable(cap: GLenum):void{
        this._gl.enable(cap);
    }

    colorMask(red: GLboolean, green: GLboolean, blue: GLboolean, alpha: GLboolean):void{
        this._gl.colorMask(red, green, blue, alpha);
    }

    deleteBuffer(buffer:WebGLBuffer | null):void{
        this._gl.deleteBuffer(buffer);
    }

    createShader(type: GLenum): WebGLShader | null{
        return this._gl.createShader(type);
    }

    shaderSource(shader: WebGLShader, source: string):void{
        this._gl.shaderSource(shader, source);
    }

    compileShader(shader: WebGLShader):void{
        this._gl.compileShader(shader);
    }

    getShaderInfoLog(shader: WebGLShader): string | null{
       return this._gl.getShaderInfoLog(shader);
    }

    getShaderParameter(shader: WebGLShader, pname: GLenum): any{
        return this._gl.getShaderParameter(shader,pname);
    }

    getExtension(extensionName:string):any{
        return this._gl.getExtension(extensionName);
    }
    
    drawElements(mode: GLenum, count: GLsizei, type: GLenum, offset: GLintptr):void{
        this._gl.drawElements(mode, count, type, offset);
    }
}