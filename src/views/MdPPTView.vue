<template>
  <div class="content">
    <div class="mdView">
      <div class="ai">
        <input type="text" placeholder="这里输入您想创建的主题，向AI提问，例如：《每周工作汇报》">
        <button>提问</button> 
        <button @click="printToPDF">导出PDF</button> 
      </div>
      <textarea
        id="mdContent"
        type="text"
        ref="textarea"
        placeholder="将在这里展示/输入/修改md"
        v-model="markdown"
        :style="{'height': textareaHeight}"
        @input="renderMarpitHtml"
      ></textarea>
    </div>
    <div class="slideView">
      <div id="marp-wrapper">
        <div v-html="renderedHtml"></div>
      </div>
    </div>
  </div>
</template>

<script>
// const { Marpit } = require('@marp-team/marpit');
const { Marp } = require('@marp-team/marp-core');
const Swal = require('sweetalert2')
import calcTextareaHeight from '@/utils/calcTextareaHeight';

export default {
  components: {

  },
  data() {
    return {
      markdown:`---
theme: gaia
_class: lead
paginate: true
backgroundImage: linear-gradient(to right, #acb6e5 , #86fde8 )
---
# 欢迎使用
## 这是一个实验性的功能
---
<!-- _color: orange-->
# 未来
## 将提供各种预置主题可供选择
- default
- gaia
- uncover
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

# 图片
![logo](https://img1.imgtp.com/2023/08/05/CsZbIRUi.png)
你可以通过任何md格式来编辑你的ppt！
未来将开放**html**

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
      textareaHeight:'auto'
    };
  },
  mounted() {
    this.renderMarpitHtml(); // 在组件挂载后执行渲染操作
  },
  methods: {
    //渲染ppt
    renderMarpitHtml() {
      if(this.markdown===""){
        this.showAlter("待渲染的md代码为空",0)
        return;
      }
      const marp = new Marp({
        printable:true,
        minifyCSS:true,
        
      })
      const { html, css } = marp.render(this.markdown);
      const htmlResponse = `
      <!DOCTYPE html>
      <html><body>
        <style>${css}</style>
        ${html}
      </body></html>
      `;
      this.renderedHtml = htmlResponse; // 更新渲染后的HTML响应
      this.textareaHeight = calcTextareaHeight(this.$refs.textarea, 1, null).height;
    },
    //弹窗
    showAlter(msg,type){
      if (type === 0) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: msg,
        })
      }else if(type === 1){
        Swal.fire(
          'success!',
          msg,
          'success'
        )
      }else if(type===3){
        Swal.fire(
          '???',
          msg,
          'question'
        )
      }
    },
    printToPDF(){
      this.showAlter("敬请期待",3)
    }
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
  height: 100vh;
  padding: 20px;
  background-color: #f0f0f0;
  height: fit-content;
}

/* 左侧区域样式 */
.mdView {
  flex: 2;
  padding: 10px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  height: fit-content;
}

/* 右侧区域样式 */
.slideView {
  flex: 1;
  min-width: calc(60vw);
  background-color: #f0f0f0;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* AI区域样式 */
.ai {
  margin-bottom: 15px;
  padding: 10px;
  background-color: #f9f9f9;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center; /* 居中对齐内容 */
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
  margin-left:5px ;
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