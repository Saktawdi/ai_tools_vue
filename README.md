<p align="center">
	<img alt="logo" src="https://cdn.jsdelivr.net/gh/Saktawdi/my-images@main/img/pixil-frame-256.png" style="width:128px;border-radius:68px">
</p>
<h1 align="center" style="margin: 30px 0 30px; font-weight: bold;">Sakta_wdi</h1>
<h4 align="center">AI_Tools_Vue</h4>
<p align="center">
	<a href="https://github.com/Saktawdi"><img src="https://img.shields.io/badge/ai__tools__vue-sakta__wdi-%23defcf9?labelColor=%23c3bef0
"></a>
</p>

# 介绍

##### 本项目主要为了集成多种AI工具于网页，使用vue3.x作为前端技术栈，目前已有功能：

- AI聊天工具
  - ai女友（live2D +  vist）
- AI生成ppt
- AI生成音乐

##### 当前版本：![Static Badge](https://img.shields.io/badge/0.5.8-green)

[demo演示地址]: https://ai.sakta.top/

##### 未来将更新的功能：

- AI聊天工具
  - [x] ~~导入文档快速总结~~
  - [x] ~~角色仓库+自定义提示词~~

  - 模型选择
    - [x] ~~谷歌Gemini Pro~~
    - [ ] 多模态模型适配
    - [ ] 百度，讯飞等

- AI生成音乐
  - [ ] 音乐文件续写（生成）
- AI生成ppt
  - [ ] ppt样式广场
  - [ ] 导出可编辑pptx功能
- 新增
  - [ ] AI绘画
  - [ ] AI识图

# 使用

1.安装依赖

```
npm install
```

2.启动服务

```
npm run serve
```

# 目录结构

普通vue项目结构，vue3.x + vuex + vue Router

以下是特殊文件的介绍：

> [!TIP]
>
> role_id查找请前往：https://huggingface.co/spaces/Artrajz/vits-simple-api
>
> role_url可以这里找：https://guansss.github.io/live2d-viewer-web/

> src/api/baseStyleMD.js
>
> 用于改变生成的ppt样式，归属md生成ppt功能

> src/api/live2DData.js
>
> 用于存储live角色信息数据，key-value格式
>
> {
>
>   id:0,
>
>   avatar:requestConfig.baseURL1 + "/profile/upload/2023/09/02/hir_20230902180743A004.png",
>
>   role_id:用于匹配vits,
>
>   height:canvas,
>
>   width:canvas,
>
>   scale:模型缩放大小,
>
>   x:canvas中心横坐标相对值,
>
>   idle:静止状态动作关键词,
>
>   talk:[在GPT模型输出时，角色动作关键词],
>
>   role_url:模型地址,
>
>   role_name:角色名称,
>
>   role_info:初始提示词
>
> }

> src/api/musicPromptData.js
>
> 用于生成音乐时，动态加载的提示语

> src\utils\calcTextareaHeight.js
>
> 用于动态扩张textare元素高度，感谢element



> src\utils\getCurrentPageHtml.js
>
> 更新页面ppt的算法，归属md生成ppt功能



> src\utils\html2maker.js
>
> 用于htmltocanvas于pptxgenjs的算法，归属md生成ppt功能

# 界面截图

> [!IMPORTANT] 无加速

![newmodel.gif](https://www.freeimg.cn/i/2024/02/01/65bbaf4a488fc.gif)

> 首页

<img src="https://cdn.jsdelivr.net/gh/Saktawdi/my-images@main/img/20230907214818.png"/>

> AI聊天界面

![1708054034751.jpg](https://www.freeimg.cn/i/2024/02/16/65ced61609ea1.jpg)

![1708054178469.png](https://www.freeimg.cn/i/2024/02/16/65ced6a47f3cb.png)

> md生成ppt功能

![](https://cdn.jsdelivr.net/gh/Saktawdi/my-images@main/img/20230907215350.png)

> AI生成音乐

![](https://cdn.jsdelivr.net/gh/Saktawdi/my-images@main/img/20230907215433.png)

> 用户中心

![](https://cdn.jsdelivr.net/gh/Saktawdi/my-images@main/img/20230907215606.png)



![](https://cdn.jsdelivr.net/gh/Saktawdi/my-images@main/img/20230907215635.png)

# 鸣谢

不分前后：

<div style="display:flex;flex-wrap: wrap;justify-content: space-around;">
<img alt="Static Badge" src="https://img.shields.io/badge/gitbrent-PptxGenJS-green?link=https%3A%2F%2Fgithub.com%2Fgitbrent%2FPptxGenJS%2F">
<img alt="Static Badge" src="https://img.shields.io/badge/katspaugh-wavesurfer.js-green?link=https%3A%2F%2Fgithub.com%2Fkatspaugh%2Fwavesurfer.js">
<img alt="Static Badge" src="https://img.shields.io/badge/sweetalert2-sweetalert2-green?link=https%3A%2F%2Fgithub.com%2Fsweetalert2%2Fsweetalert2">
<img alt="Static Badge" src="https://img.shields.io/badge/niklasvh-html2canvas-green?link=https%3A%2F%2Fgithub.com%2Fniklasvh%2Fhtml2canvas">
<img alt="Static Badge" src="https://img.shields.io/badge/marp--team-marp--core-green?link=https%3A%2F%2Fgithub.com%2Fmarp-team%2Fmarp-core">
<img alt="Static Badge" src="https://img.shields.io/badge/guansss-pixi--live2d--display-green?link=https%3A%2F%2Fgithub.com%2Fguansss%2Fpixi-live2d-display">
<img alt="Static Badge" src="https://img.shields.io/badge/Artrajz-vits--simple--api-green">
<img alt="Static Badge" src="https://img.shields.io/badge/facebookresearch-audiocraft-green?link=https%3A%2F%2Fgithub.com%2Fguansss%2Fpixi-live2d-display">
</div>

# 开源协议

MIT协议