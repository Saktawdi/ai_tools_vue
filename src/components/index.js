import * as PIXI from 'pixi.js'
import {
  Live2DModel,
  MotionPreloadStrategy,
  InternalModel,
  MotionPriority,
  config
} from 'pixi-live2d-display';

// 挂载pixi
window.PIXI = PIXI;
export async function init(url,Mheight = "375",Mwidth = "256",Mscale = 0.1,mx = 0,openDrawp = false) {
  if(url === "") url = 'https://cdn.jsdelivr.net/gh/Eikanya/Live2d-model/%E5%B4%A9%E5%9D%8F%E5%AD%A6%E5%9B%AD2/Kiana/model.json'
  const model = await Live2DModel.from(url, { motionPreload: MotionPreloadStrategy.NONE,})
  // 引入模型 
  // const model = await Live2DModel.from('../../src/assets/model2/HK416_805/normal.model3.json', { motionPreload: MotionPreloadStrategy.NONE,  })
  // 创建模型对象
  // console.log("model::",model)
  const app = new PIXI.Application({
    // 配置模型舞台
    view: document.getElementById('canvas_view'),
    // 背景是否透明
    transparent: true,
    autoDensity:true,
    autoResize: true,
    antialias: true,
    // 高度
    height: Mheight,
    // 宽度
    width: Mwidth
  })

  // 鼠标跟踪方法
  model.trackedPointers = [{ id: 1, type: 'pointerdown', flags: true }, { id: 2, type: 'mousemove', flags: true }]
  // 添加一个跟踪指针的数据
  // model.trackedPointers[1] = { id: 1, type: 'pointerdown', flags: true };
  // model.trackedPointers[2] = { id: 2, type: 'mousemove', flags: true };
  // 添加模型到舞台
  app.stage.addChild(model)
  // 模型的缩放
  model.scale.set(Mscale)
  // 模型的位置,x,y相较于窗口左上角
  model.x = mx
  // 添加模型状态管理器
  const a = new InternalModel(model)
  model.InternalModel = a

  // 绑定模型点击事件动作
  model.on('pointerdown', (hitAreas) => {
    // hitAreas:模型的一些上下文
    const { x, y } = hitAreas.data.global 
    const point = model.hitTest(x, y)
    model.motion(`tap_${point[0]}`,0,MotionPriority.FORCE);
  });

  // model.idleMotionPriority = "TapHead"


  // 绑定模型拖拽方法
  if(openDrawp){
    draggable(model);
  }
  //添加模型范围遮罩
  // addFrame(model);
  // /**
  //  * 模型区域范围遮罩
  //  * @param {Live2DModel} model -模型对象
  //  */
  // function addFrame(model) {
  //   const foreground = PIXI.Sprite.from(PIXI.Texture.WHITE);
  //   foreground.width = model.internalModel.width;
  //   foreground.height = model.internalModel.height;
  //   foreground.alpha = 0.2;

  //   model.addChild(foreground);
  //   foreground.visible = true
  // }

  /**
   * 模型拖拽方法
   * @param {Live2DModel} model -模型对象
   */
  function draggable(model) {
    model.buttonMode = true;
    model.on("pointerdown", (e) => {
      model.dragging = true;
      model._pointerX = e.data.global.x - model.x;
      model._pointerY = e.data.global.y - model.y;
    });
    model.on("pointermove", (e) => {
      if (model.dragging) {
        model.position.x = e.data.global.x - model._pointerX;
        model.position.y = e.data.global.y - model._pointerY;
      }
    });
    model.on("pointerupoutside", () => (model.dragging = false));
    model.on("pointerup", () => (model.dragging = false));
  }

  // 查看模型触发区域
  // var hitAreas = model.internalModel.hitAreas;
  // console.log(hitAreas)
  // console.log(model)
  config.sound = false
  return model

}


 /**
   * 播放静态动画
   * @param {Live2DModel} model -模型对象
   * @param {string} key - 动画组别关键词
   */
export function playIdle(model,key) {
  model.motion(key,0,MotionPriority.NORMAL);
  model.internalModel.motionManager.state.setReservedIdle(key,0);
  model.internalModel.motionManager.groups.idle = key;
}

/**
 * 
 * @param {Live2DModel} model  -模型对象
 * @param {string} key - 动画组别关键词
 */
export function playTalk(model, key) {
  if (model.internalModel.motionManager.isFinished()) {
    model.motion(key, 0,MotionPriority.FORCE);
  }
}







