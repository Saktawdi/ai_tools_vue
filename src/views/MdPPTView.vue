<template>
  <div class="content">
    <div class="mdView">
      <div class="ai">
        <input type="text" placeholder="这里输入您想创建的主题，向AI提问，例如：《每周工作汇报》" v-model="userQuestion">
        <button @click="askAI">提问</button>
        <button @click="printToPDF">导出PDF</button>
      </div>
      <textarea id="mdContent" type="text" ref="textarea" placeholder="将在这里展示/输入/修改md" v-model="markdown"
        :style="{ 'height': textareaHeight }" @input="renderMarpitHtml"></textarea>
    </div>
    <div class="slideView">
      <div id="marp-wrapper">
        <div class="pptBox" v-html="currentPageHtml"></div>
        <div class="pptOption" v-if="true">
          <button @click="prevPage" :disabled="currentPage === 1" class="left"></button>
          <span>{{ currentPage }} / {{ totalNumPages }}</span>
          <button @click="nextPage" :disabled="currentPage === totalNumPages" class="right"></button>
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
import { baseStyleMD, themeDatas ,themeCSS} from "@/api/baseStyleMD"
import { requestConfig } from '@/request';

export default {
  components: {

  },
  data() {
    return {
      markdown: `<!-- header: 这是头-->
# 欢迎使用 **智构幻图**
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
你可以通过任何md格式来编辑你的ppt！ ![pic](https://img.zcool.cn/community/0104c15cd45b49a80121416816f1ec.jpg@1280w_1l_2o_100sh.jpg)
并且支持md注释
 **html代码** 以及表情已经开放🥰[👌你将能实现更多创意！]
<div class='columns'>
  <button>这是1</button>
  <button>这是2</button>
</div>

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
      themeList: themeDatas,
      themeID: 0,
      userQuestion: "",
    };
  },
  mounted() {
    var userInfo  = this.$store.getters.getUserInfo;
    if(userInfo.userName === "游客"){
      this.$router.push('/roleDisable')
    }
    this.renderMarpitHtml(); // 在组件挂载后执行渲染操作
    if (this.currentPageHtml === '') this.currentPageHtml = this.renderedHtml;
  },
  computed: {
    totalNumPages() {
      const svgTags = (this.renderedHtml.match(/<section[^>]*>/g) || []).length;
      return svgTags;
    },
    getUserData() {
      var userInfo = this.$store.getters.getUserInfo;
      return userInfo;
    },
    getToken() {
      return this.$store.state.token;
    },
  },
  methods: {
    //渲染ppt
    renderMarpitHtml() {
      if (this.markdown === "") {
        showAlter("待渲染的md代码为空", 0)
        return;
      }
      const marp = new Marp({
        printable: true,
        minifyCSS: true,
        emoji:true,
        html:true,

      })
      let realyMarkdown = baseStyleMD[this.themeID];
      if(realyMarkdown.includes('sakta')){
        const university = marp.themeSet.add(themeCSS[this.themeID - 3].data);
        marp.themeSet.addTheme(university);
      }
      realyMarkdown += this.markdown;
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
    //ai
    async askAI() {
      if (this.userQuestion === "") {
        showAlter("请输入要制作的主题捏~", 99);
        return;
      }
      let question = `接下来你会用md格式的代码来制作一份ppt，
      每当你要分页的时候，请单独一行使用‘---’符号，一页不要塞进太多内容,多分页；
      ppt结构大概是标题大纲-目录-当前标题-内容这样；
      如果过程中你想发送一张照片时，请同样使用 Markdown ,并且 不要有反斜线, 不要用代码块。使用 Unsplash API (https://source.unsplash.com/1280x720/? < PUT YOUR QUERY HERE >)。
      最后，请记住你将要制作的ppt的主题是《${this.userQuestion}》,文案丰富点，最少3000字,18页。`;
      const swalInstance = showAlter("等待AI作答......", 5);
      this.markdown = "";
      //Todo:stream响应答复
      const url = requestConfig.baseURL1 + '/v1/chat/pri/send/stream';
      const headers = {
        'token': this.getToken,
        'Content-Type': 'application/json'
      };
      const data = {
        "model": "gpt-3.5-turbo-16k",
        "messages": [
          {
            "role": "system",
            "content": "你是一个可靠的助手，将尽力帮助用户完成目标。你的回答里将不会出现任何有关AI的字眼，并且不会有任何联系方式以及URL推广。"
          },
          {
            "role": "user",
            "content": question
          }
        ],
        "temperature": 0.8,
        "stream": true
      };
      await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(data),
      })
        .then(response => {
          if (response.status === 401) {
            showAlter("登录已过期，请重新登录！")
            this.$store.dispatch('clearToken')
            this.$router.push('/login')
          }
          if(response.status === 500){
            showAlter("AI服务器异常，请稍后再试")
          }
          const reader = response.body.getReader(); // Get the reader from the response body
          let result = ''; // Initialize an empty string to store the result

          // const intervalId = setInterval(() => {
          //   // Update the markdown variable with the text so far
          //   this.markdown = result;
          // }, 100);
          const self = this; // Save the Vue component context
          function processText({ done, value }) {
            // Read the data from the stream
            if (done) {
              // If the stream is done, clear the interval and return the result
              swalInstance.close();
              // clearInterval(intervalId);
              showAlter("生成成功!",2)
              self.renderMarpitHtml();
              console.log('Stream ended');
              return result;
            }
            result += new TextDecoder().decode(value); // Decode the value as a UTF-8 string
            const lines = result.split('\n');
            result = lines.pop(); // Save the incomplete line for the next iteration
            for (const line of lines) {
              // console.log("line",line)
              if (line.trim().startsWith('data: ') && !line.includes("[DONE]",0)) {
                try {
                  const jsonData = JSON.parse(line.replace("data:","").trim()); // Removing "data: " prefix
                  if (jsonData.choices[0].delta && jsonData.choices[0].delta.content) {
                    const content = jsonData.choices[0].delta.content;
                    // trouble
                    self.markdown += content;
                    // console.log('Received content:', content);
                    
                  }
                } catch (error) {
                  swalInstance.close();
                  showAlter("转换失败！",0)
                  console.error('Error parsing JSON:', error);
                }
              }
            }

            return reader.read().then(processText); // Read the next chunk
          }

          return reader.read().then(processText);
        })
        .catch(error => {
          swalInstance.close();
          console.error('Error:', error);
        });
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
    handleItemClick(item) {
      this.themeID = item.id;
      this.renderMarpitHtml();
    },
    //转为pdf
    async printToPDF() {
      const swalInstance = showAlter("正在下载中....", 5);
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
  height: calc(100vh - 90px);
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

.marpit img {
  max-height: 256px;
  max-width: 256px;
}

.pptOption {
  position: absolute;
  /* 调整底部间距 */
  left: 70%;
  bottom: 31%;
  z-index: 99;
  /* 居中 */
  transform: translateX(-50%);
}

.pptOption button {
  background-color: #007bff;
  opacity: 0.6;
  padding: 32px 32px;
  clip-path: polygon(
        0 0,
        30px 50%,
        0 100%,
        calc(100% - 30px) 100%,
        100% 50%,
        calc(100% - 30px) 0
  );
}

.left {
  transform: scaleX(-1) scale(0.5);
}

.right{
  transform:scale(0.5);
}

.themeBox {
  display: flex;
  width: 100%;
  height: 31.5%;
  background-color: #ffffff;
  border-radius: 10px;
  overflow-x: auto;
  /* Enable horizontal scrolling */
}

.themeBox>div {
  margin: 10px 2px 0px 2px;
  min-width: 33%;
  max-height: 256px;
  cursor: pointer;
  flex: 0 0 auto;
  text-align: center;
  border: 1px solid #ccc;
}

.themeBox>div>img {
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