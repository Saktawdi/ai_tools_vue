<template>
  <div class="content">
    <div class="mdView">
      <div class="ai">
        <input type="text" placeholder="这里输入您想创建的主题，向AI提问，例如：《每周工作汇报》">
        <button>提问</button>
        <button @click="printToPDF">导出PDF</button>
      </div>
      <textarea id="mdContent" type="text" ref="textarea" placeholder="将在这里展示/输入/修改md" v-model="markdown"
        :style="{ 'height': textareaHeight }" @input="renderMarpitHtml"></textarea>
    </div>
    <div class="slideView">
      <div id="marp-wrapper">
        <div class="pptBox" v-html="currentPageHtml"></div>
        <div class="pptOption" v-if="true">
          <button @click="prevPage" :disabled="currentPage === 1">上一页</button>
          <span>{{ currentPage }} / {{ totalNumPages }}</span>
          <button @click="nextPage" :disabled="currentPage === totalNumPages">下一页</button>
        </div>
      </div>
      <div class="themeBox">
        <div v-for="(item, index) in themeList" :key="index" @click="handleItemClick(item)">
          <img :src="item.image" alt="Image" />
          <p>{{ item.title }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const { Marp } = require('@marp-team/marp-core');
// import calcTextareaHeight from '@/utils/calcTextareaHeight';
import { showAlter } from "@/utils/showAlter";
import generatePPTXFromHTML from "@/utils/html2maker";
import getCurrentPageHtml from "@/utils/getCurrentPageHtml";
import { baseStyleMD, themeDatas } from "@/api/baseStyleMD"

export default {
  components: {

  },
  data() {
    return {
      markdown: `# 欢迎使用 **智构幻图**
## 这是一个实验性的功能
---
<!-- _color: orange-->
# 未来
## 将提供各种预置主题可供选择
- default
- 盖亚
- 现代
---
# 代码高亮与表格
\`\`\`c++
std::vector<int> nums{1,2,3,4,5};
int sum = std::accumulate(nums.begin(), nums.end(), 0); 
//sum = 15
\`\`\`
| 1    | 2    | 3    |
| ---- | ---- | ---- |
| 生活就像海洋    | 只有意志坚定的人    | 才能到达彼岸   |
| d    | e    | f    |
| g    | h    | i    |
---

<!--backgroundImage: linear-gradient(to right, #fddb92 0%, #d1fdff 100%);-->
# 图片
![pic](https://img.zcool.cn/community/0104c15cd45b49a80121416816f1ec.jpg@1280w_1l_2o_100sh.jpg)
你可以通过任何md格式来编辑你的ppt！
并且支持md注释
未来将开放 **html代码** [你将能实现更多创意！]

---
# math
Render inline math such as $ax^2+bc+c$.
$$ I_{xx}=\\int\\int_Ry^2f(x,y)\\cdot{}dydx $$
$$
f(x) = \\int_{-\\infty}^\\infty
    \\hat f(\\xi)\\,e^{2 \\pi i \\xi x}
    \\,d\\xi
$$
`,
      renderedHtml: '', // 初始化为一个空字符串
      textareaHeight: 'calc(75vh)',
      currentPage: 1,
      currentPageHtml: '',
      themeList:themeDatas,
      themeID: 0,
    };
  },
  mounted() {
    this.renderMarpitHtml(); // 在组件挂载后执行渲染操作
    if (this.currentPageHtml === '') this.currentPageHtml = this.renderedHtml;
  },
  computed: {
    totalNumPages() {
      const svgTags = (this.renderedHtml.match(/<section[^>]*>/g) || []).length;
      return svgTags;
    },
  },
  methods: {
    //渲染ppt
    renderMarpitHtml() {
      if (this.markdown === "") {
        showAlter("待渲染的md代码为空", 0)
        return;
      }
      let realyMarkdown = baseStyleMD[this.themeID];
      realyMarkdown += this.markdown;
      const marp = new Marp({
        printable: true,
        minifyCSS: true,

      })
      const { html, css } = marp.render(realyMarkdown);
      const htmlResponse = `
      <!DOCTYPE html>
      <html><body>
        <style>${css}</style>
        ${html}
      </body></html>
      `;
      this.renderedHtml = htmlResponse; // 更新渲染后的HTML响应
      this.currentPageHtml = getCurrentPageHtml(this.renderedHtml, this.currentPage);
    },
    // 幻灯片
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.currentPageHtml = getCurrentPageHtml(this.renderedHtml, this.currentPage);
      }
    },
    // 幻灯片
    nextPage() {
      if (this.currentPage < this.totalNumPages) {
        this.currentPage++;
        this.currentPageHtml = getCurrentPageHtml(this.renderedHtml, this.currentPage);
      }
    },
    // 换主题
    handleItemClick(item){
      this.themeID = item.id;
      this.renderMarpitHtml();
    },
    //转为pdf
    async printToPDF() {
      const swalInstance = showAlter("正在下载中....", 4);
      // showAlter("敬请期待",3);
      try {
        const res = await generatePPTXFromHTML(this.renderedHtml);
        console.log("res", res);
        if (res.status === true) {
          swalInstance.close();
          showAlter("下载成功！", 2);
        } else {
          swalInstance.close();
          showAlter("下载失败！", 0);
          console.log(res.msg);
        }
      } catch (error) {
        swalInstance.close();
        showAlter("转换失败！", 0);
        console.log(error);
      }
    },
  }
}
</script>


<style>
@import '@sweetalert2/theme-bootstrap-4/bootstrap-4.css';

body {
  font-family: "lucida grande", "lucida sans unicode", lucida, helvetica, "Hiragino Sans GB", "Microsoft YaHei", "WenQuanYi Micro Hei", sans-serif;
}

/* 整体容器样式 */
.content {
  display: flex;
  justify-content: space-between;
  height: calc(100vh - 78px);
  padding: 20px;
  background-color: #f0f0f0;
}

/* 左侧区域样式 */
.mdView {
  flex: 2;
  padding: 10px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* 右侧区域样式 */
.slideView {
  flex: 1;
  min-width: calc(60vw);
  background-color: #f0f0f0;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* ppt区域 */
#marp-wrapper {
  max-height: 68.5%;
  overflow: hidden;
}

.pptBox img {
  max-height: 256px;
  max-width: 256px;
}

.pptOption {
  position: absolute;
  /* 调整底部间距 */
  left: 70%;
  bottom: 30.5%;
  z-index: 99;
  /* 居中 */
  transform: translateX(-50%);
}

.themeBox {
  display: flex;
  width: 100%;
  height: 31.5%;
  background-color: #ffffff;
  border-radius: 10px;
  overflow-x: auto; /* Enable horizontal scrolling */
}

.themeBox > div {
  margin: 10px 2px 0px 2px;
  min-width: 33%;
  max-height: 256px;
  cursor: pointer;
  flex: 0 0 auto;
  text-align: center;
  border:1px solid #ccc;
}
.themeBox > div >img {
  margin-top: 5px;
  margin-bottom: -10px;
  max-width: 98%;
  max-height: 85%;
}

/* AI区域样式 */
.ai {
  margin-bottom: 15px;
  padding: 10px;
  background-color: #f9f9f9;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
  /* 居中对齐内容 */
}

/* 输入框样式 */
input[type="text"],
textarea {
  width: 98%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: white;
  font-size: 18px;
}

#mdContent {
  height: calc(80vh);
  width: 95%;
  resize: none;
  font-size: 16px;
  color: #333;
}

/* 按钮样式 */
button {
  margin-left: 5px;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
}

/* 按钮悬停效果 */
button:hover {
  background-color: #0056b3;
}

</style>