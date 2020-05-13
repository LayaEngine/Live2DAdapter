
import { Live2DCubismFramework as cubismmodel } from '../../framework/model/cubismmodel';
import { Live2DCubismFramework as cubismmotion } from '../../framework/motion/cubismmotion';
import { Live2DCubismFramework as cubismexpressionmotion } from '../../framework/motion/cubismexpressionmotion';
import { Live2DCubismFramework as acubismmotion } from '../../framework/motion/acubismmotion';
import { Live2DCubismFramework as cubismmodelsettingjson } from '../../framework/cubismmodelsettingjson';

import CubismModelSettingJson = cubismmodelsettingjson.CubismModelSettingJson;
import ACubismMotion = acubismmotion.ACubismMotion;
import CubismModel = cubismmodel.CubismModel;
import CubismMotion = cubismmotion.CubismMotion;
import CubismExpressionMotion = cubismexpressionmotion.CubismExpressionMotion;

/**
 * 继承自framework model，Laya封装加载
 */
export class LayaModel extends Laya.Sprite{
    private _model:CubismModel;
    public setting:CubismModelSettingJson;

    constructor(){
        super();
    }

    public loadModel(buffer:ArrayBuffer):void{

    } 

    public createSetting(buffer:ArrayBuffer):void{
        this.setting = new CubismModelSettingJson(buffer,buffer.byteLength);
    }

    /**
     * 载入运动数据
     * @param buffer 读取motion3.json文件的缓冲区
     * @param size 缓冲区大小
     * @param name 动作的名称
     * @param onFinishedMotionHandler 动态播放结束时调用的回调函数
     * @return 运动节点
     */
    public loadMotion(
        buffer: ArrayBuffer,
        size: number,
        onFinishedMotionHandler?: any
      ) :CubismMotion{
          return CubismMotion.create(buffer, size, onFinishedMotionHandler);
      } 

    /**
     * 读取面部表情数据
     * @param buffer 读取exp文件的缓冲区
     * @param size 缓冲区大小
     */
    public loadExpression(
        buffer: ArrayBuffer,
        size: number,
      ): ACubismMotion {
        return CubismExpressionMotion.create(buffer, size);
      }

    public loadUserData(buffer: ArrayBuffer, size: number): void {
    
    }

    public loadPhysics(buffer: ArrayBuffer, size: number): void {

    }

    public loadPose(buffer: ArrayBuffer, size: number): void {
    }
}