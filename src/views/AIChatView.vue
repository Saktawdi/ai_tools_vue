<template>
  <div class="AIChat">
    <live2D ref="live2DComponent" :url="live2dList[Live2DIndex].role_url" :height="live2dList[Live2DIndex].height"
      :width="live2dList[Live2DIndex].width" :scale="live2dList[Live2DIndex].scale" :x="live2dList[Live2DIndex].x"
      :ideaAc="live2dList[Live2DIndex].idle" :talkAc="live2dList[Live2DIndex].talk"></live2D>
    <button class="showList button" v-if="isHidden" @click="toggleHidden" style="width:48px;">
      <img src="../assets/right.svg" alt="显性" class="show-icon" style="width:15px;" />
    </button>
    <transition name="slide" mode="out-in">
      <div class="live2d-role" v-if="isHidden">
        <div v-for="(role, index) in live2dList" :key="role.id" class="avatar-container"
          :class="{ 'active-avatar': Live2DIndex === index }" @click="updateLive2DIndex(index)">
          <img :src="role.avatar" alt="Role Avatar" class="live2d-avatar">
        </div>
      </div>
    </transition>
    <div class="historyList" :class="{ 'hidden': isHidden }">
      <div class="optionBox">
        <button class="newChat button" @click="createNewChat">
          <img src="../assets/add.svg" alt="新建" class="add-icon" style="width:15px;" />
          新聊天
        </button>
        <button class="save button" @click="saveChatHistory">
          <img src="../assets/save.svg" alt="保存" class="add-icon" style="width:15px;" />
        </button>
        <button class="hiden button" @click="toggleHidden">
          <img src="../assets/left.svg" alt="隐藏" class="hiden-icon" style="width:15px;" />
        </button>
      </div>
      <div v-for="historyItem in chatHistoryItems" :key="historyItem.id"
        :class="{ 'historyItem': true, 'historyItemActive': historyItem.isActive }"
        @click="activateHistoryItem(historyItem.id)">
        <span>{{ historyItem.name }}</span>
        <img class="delete-icon" @click="deleteHistoryItem(historyItem.id)" src="../assets/delete.svg" alt="Delete Icon"
          style="margin-right:15px;width:28px;" />
      </div>
    </div>
    <div class="chat-container" ref="chatContainer">
      <div class="messagesBox">
        <div v-for="(message, index) in nowChatHistory" :key="index" class="messages">
          <div class="avatar" :class="{ 'user-avatar': message.fromUser, 'ai-avatar': !message.fromUser }">
            <img :src="message.avatar" alt="Avatar" class="avatar" />
          </div>
          <div class="message">
            <div :class="{ 'user-message': message.fromUser, 'ai-message': !message.fromUser }">
              {{ message.content }}
            </div>
            <div>
              <img src="../assets/copy.svg" alt="复制" :class="{'icon-copy-user':message.fromUser,'icon-copy-ai':!message.fromUser}" @click="copyMsg(message.content)"/>
            </div>
            <audio class="audio-role" ref="audioPlayers" controls :src="streamingAudioUrl[index]" v-if="!message.fromUser && streamingAudioUrl[index]!==''" @canplay="readyPlay"></audio>
          </div>
        </div>
      </div>
    </div>
    <textarea ref="textarea" v-model="userInput" @keydown.enter="handleEnterKey" class="user-textarea" placeholder="畅你所言"
      :style="{ 'height': textareaHeight }" :disabled="!isTextareaEnabled"></textarea>
    <div v-if="!isTextareaEnabled" class="loading-overlay">
      <!-- 加载动画效果 -->
      <div class="loading-spinner"></div>
    </div>
  </div>
</template>

<script>
import calcTextareaHeight from '@/utils/calcTextareaHeight';
import { showAlter } from "@/utils/showAlter";
import live2D from "@/components/live2D.vue";
import { live2dList } from "@/api/live2DData";
import { requestConfig } from "@/request";
import clipboard from 'clipboardy';
// import VueMarkdown from 'vue-markdown';

export default {
  components: {
    live2D,
  },
  data() {
    return {
      live2dList: live2dList,
      Live2DIndex: 0,
      streamingAudioUrl: [], // 存储流式音频 URL
      audioReady:false,
      chatHistory: [], // 存放聊天历史
      nowChatHistory: [],// 现在条目的历史记录
      isHidden: false, // 控制历史记录是否隐藏的布尔值
      chatHistoryItems: [
        { id: 1, name: 'Chat 1', isActive: false },
        { id: 2, name: 'Chat 2', isActive: false },
        { id: 3, name: 'Chat 3', isActive: false },
      ],//历史聊天条目
      userInput: '',   // 用户输入
      isTextareaEnabled: true,
      textareaHeight: '24px',
      messages: [
        {
          "role": "system",
          "content": "你是一个可靠的助手，将尽力帮助用户完成目标。你的回答里将不会出现任何有关AI、openAI以及chatGPT的字眼，并且不会透露任何关于你的模型的事情。"
        },
      ],
    };
  },
  mounted() {
    var userInfo = this.$store.getters.getUserInfo;
    if (userInfo.userName === "游客") {
      this.$router.push('/roleDisable')
    }
  },
  computed: {
    getUserData() {
      var userInfo = this.$store.getters.getUserInfo;
      return userInfo;
    },
    getToken() {
      return this.$store.state.token;
    },
  },
  created() {
    // 从本地存储加载聊天历史记录
    const savedChatHistory = localStorage.getItem('chatHistory');
    if (savedChatHistory) {
      this.chatHistory = JSON.parse(savedChatHistory);
    }
    // 初始化 chatHistoryItems，使用新的 id 字段
    this.chatHistoryItems = this.chatHistory.map(item => {
      return { id: item.id, name: item.item, isActive: false };
    });
    // 初始化性格特点
    if(this.live2dList[this.Live2DIndex].role_info != ""){
      this.messages[0].content = this.live2dList[this.Live2DIndex].role_info;
    }
  },
  watch: {
    userInput() {
      this.autoExpandTextarea();
    }
  },
  methods: {
    autoExpandTextarea() {
      this.textareaHeight = calcTextareaHeight(this.$refs.textarea, 1, 7).height;
    },
    handleEnterKey(event) {
      // 检查是否同时按下了 Shift 键
      if (event.shiftKey) {
        // 如果按下了 Shift 键，执行换行操作
        this.userInput += "\n";
      } else {
        // 如果没有按下 Shift 键，执行发送消息的操作
        this.sendMessage();
      }
    },
    //发送用户信息
    async sendMessage() {
      if (this.userInput === "") {
        showAlter("请输入内容！亲", 99);
        return;
      }
      if (this.nowChatHistory.length === 0) {
        const newItem = { id: Date.now(), name: this.userInput, isActive: true };
        this.chatHistoryItems.push(newItem);
      }
      // 将用户输入添加到当前历史记录数组
      const userMessage = {
        content: this.userInput,
        avatar: this.getUserData.avatar,
        fromUser: true,
      };
      this.nowChatHistory.push(userMessage);
      this.messages.push({
        "role": "user",
        "content": this.userInput
      })
      const container = this.$refs.chatContainer;
      container.scrollTop = container.scrollHeight;
      // TODO: 调用 AI 进行回复，将 AI 回复添加到 chatHistory 中
      this.userInput = ''; // 清空用户输入
      this.streamingAudioUrl.push("");
      await this.AiRespon(this.userInput);
    },
    // 处理AI回复
    async AiRespon() {
      this.isTextareaEnabled = false;
      const url =  requestConfig.baseURL1 + '/v1/chat/pri/send/stream';
      const headers = {
        'token': this.getToken,
        'Content-Type': 'application/json'
      };
      const data = {
        "model": "gpt-3.5-turbo-16k",
        "messages": this.messages,
        "temperature": 0.5,
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
          if (response.status === 500) {
            showAlter("AI服务器异常，请稍后再试")
            this.streamingAudioUrl.push("")
          }
          if(response.status === 404){
            showAlter("AI服务器正在维护中哦~请耐心等待")
            this.streamingAudioUrl.push("")
          }
          const aiMessage = {
            content: '',
            avatar: this.live2dList[this.Live2DIndex].avatar,
            fromUser: false,
          };
          const reader = response.body.getReader(); // Get the reader from the response body
          let result = ''; // Initialize an empty string to store the result
          const self = this;
          // const randomIndex = Math.floor(Math.random() * this.live2dList[this.Live2DIndex].talk.length);
          function processText({ done, value }) {
            // Read the data from the stream
            if (done) {
              self.messages.push({
                "role": "assistant",
                "content": aiMessage.content
              },);
              const container = self.$refs.chatContainer;
              container.scrollTop = container.scrollHeight;
              self.isTextareaEnabled = true;
              self.playAudio(aiMessage.content);
              return result;
            }
            result += new TextDecoder().decode(value); // Decode the value as a UTF-8 string
            const lines = result.split('\n');
            result = lines.pop(); // Save the incomplete line for the next iteration
            for (const line of lines) {
              // console.log("line", line)
              if (line.trim().startsWith('data: ') && !line.includes("[DONE]", 0)) {
                try {
                  const jsonData = JSON.parse(line.replace("data:", "").trim()); // Removing "data: " prefix
                  if (jsonData.choices[0].delta && jsonData.choices[0].delta.content) {
                    const content = jsonData.choices[0].delta.content;
                    // trouble
                    aiMessage.content += content;
                    let n = self.nowChatHistory.length;
                    if (self.nowChatHistory[n - 1].fromUser) {
                      self.nowChatHistory.push(aiMessage);
                    } else {
                      self.nowChatHistory.pop();
                      self.nowChatHistory.push(aiMessage);
                      const container = self.$refs.chatContainer;
                      container.scrollTop = container.scrollHeight;
                      self.$refs.live2DComponent.loadTalk();
                      // self.nowChatHistory[n - 1].content = aiMessage.content;
                    }
                    // console.log('Received content:', content);
                  }
                } catch (error) {
                  self.isTextareaEnabled = true;
                  showAlter("转换失败！", 0)
                  console.error('Error parsing JSON:', error);
                }
              }
            }
            return reader.read().then(processText); // Read the next chunk
          }
          return reader.read().then(processText);
        })
        .catch(error => {
          this.isTextareaEnabled = true;
          showAlter("未知错误！", 0)
          console.error('Error:', error);
        });
    },
    // 处理音频数据
    async playAudio(content) {
      if(this.live2dList[this.Live2DIndex].role_id === "-1"){
        this.streamingAudioUrl.push("");
        return;
      }
      try {
        const streamingAudioUrl = `https://artrajz-vits-simple-api.hf.space/voice/vits?text=${content}&id=${this.live2dList[this.Live2DIndex].role_id}&streaming=true`;
        this.streamingAudioUrl.push(streamingAudioUrl);
        const index = this.streamingAudioUrl.length - 1;
        this.$refs.audioPlayers[index].src = streamingAudioUrl;
        // 触发播放
        this.playAudioAtIndex(index);
      } catch (error) {
        console.error("Error fetching streaming audio:", error);
      }
    },
    playAudioAtIndex(index) {
      const audioElement = this.$refs.audioPlayers[index];
      if (audioElement && this.audioReady) {
        setTimeout(() => {
          try {
            audioElement.load();
            audioElement.play();
          } catch (error) {
            console.log("playAudioAtIndex::error::",error)
          }
          // const randomIndex = Math.floor(Math.random() * this.live2dList[this.Live2DIndex].talk.length);
          this.$refs.live2DComponent.loadTalk();
      }, 500);
      }
    },
    readyPlay(){
      this.audioReady = true;
    },
    // 删除历史记录
    deleteHistoryItem(id) {
      if (!this.isTextareaEnabled) {
        showAlter("请耐心等待当前会话结束！")
        return
      }
      const index = this.chatHistoryItems.findIndex(item => item.id === id);
      if (index !== -1) {
        // 删除 chatHistoryItems 中的项
        this.chatHistoryItems.splice(index, 1);
        // 清空 nowChatHistory
        this.nowChatHistory = [];
        this.streamingAudioUrl = [""];
        this.messages = [
          {
            "role": "system",
            "content": this.live2dList[this.Live2DIndex].role_info
          },
        ];

        // 删除 chatHistory 中的对应项
        const chatHistoryIndex = this.chatHistory.findIndex(item => item.id === id);
        if (chatHistoryIndex !== -1) {
          this.chatHistory.splice(chatHistoryIndex, 1);
        }
      }
    },
    // 激活历史记录
    activateHistoryItem(id) {
      if (!this.isTextareaEnabled) {
        return
      }
      const index = this.chatHistoryItems.findIndex(item => item.id === id);
      if (index !== -1) {
        this.chatHistoryItems.forEach((item, i) => {
          item.isActive = i === index;
        });
        // 根据激活的历史记录项，更新当前的聊天记录
        const activeHistory = this.chatHistory.find(item => item.item === this.chatHistoryItems[index].name);
        if (activeHistory) {
          this.nowChatHistory = activeHistory.data;
          this.streamingAudioUrl = activeHistory.audio;
          var roleType = "";
          this.nowChatHistory.forEach((item) => {
            if (item.fromUser) {
              roleType = "user"
            } else {
              roleType = "assistant"
            }
            this.messages.push({
              "role": roleType,
              "content": item.content
            },);
          })
        } else {
          this.nowChatHistory = [];
        }
      }
    },
    // 新建聊天
    createNewChat() {
      if (this.nowChatHistory.length === 0) {
        showAlter("直接按回车键发信息即可了哦~", 99);
        return;
      }
      let itemTemp;
      this.chatHistoryItems.forEach((item) => {
        if (item.isActive === true) {
          itemTemp = item;
          item.isActive = false;
        }
      });
      this.chatHistory.push({ id: itemTemp.id, item: itemTemp.name, data: this.nowChatHistory ,audio:this.streamingAudioUrl});
      this.nowChatHistory = [];
      this.messages = [
        {
          "role": "system",
          "content": this.live2dList[this.Live2DIndex].role_info
        },
      ];
      this.streamingAudioUrl = []
    },
    //保存历史记录
    saveChatHistory() {
      if (this.chatHistory.length != this.chatHistoryItems.length) {
        var n = this.chatHistoryItems.length;
        if (n - 1 < 0) n = 0;
        this.chatHistory.push({ id: this.chatHistoryItems[n - 1].id, item: this.chatHistoryItems[n - 1].name, data: this.nowChatHistory ,audio:this.streamingAudioUrl});
      }
      localStorage.setItem('chatHistory', JSON.stringify(this.chatHistory));
      showAlter("保存成功", 1);
    },
    //隐藏历史列表
    toggleHidden() {
      this.isHidden = !this.isHidden; // 切换隐藏状态
    },
    // 改变live2D角色
    updateLive2DIndex(index) {
      this.Live2DIndex = index;
      if(this.live2dList[this.Live2DIndex].role_info != ""){
        this.messages[0].content = this.live2dList[this.Live2DIndex].role_info;
      }
      setTimeout(() => {
        this.$refs.live2DComponent.initLive2D();
      }, 10);
    },
    // 复制ai信息
    async copyMsg(msg){
      await clipboard.write(msg);
      showAlter("复制完成~~(。・ω・。)",4);
    },
  },
};
</script>

<style>
/* 主题色 */
:root {
  --primary-color: #3498db;
  /* 蓝色 */
  --secondary-color: #e74c3c;
  /* 红色 */
  --background-color: #f5f5f5;
  /* 浅灰背景色 */
  --card-background: #ffffff;
  /* 卡片背景色 */
  --text-color: #333333;
  /* 文本颜色 */
}

span {
  width: 100%;
  text-align: center;
}

.AIChat {
  display: flex;
  background-color: #f5f5f5;
  height: calc(100vh - 48px);
}

.button {
  margin: 0.5px;
  border-radius: 2px;
  padding: 0px;
  width: 100%;
  height: 48px;
}

/* live2d选择角色 */

/* 进场滑动效果 */
.slide-enter-active{
  transform: translateX(-100%);
  transition: transform 0.5s ease-in-out;
}

.slide-enter-to {
  transform: translateX(0%);
}

/* 出场滑动效果 */
.slide-leave-active {
  transition: transform 0.5s ease-in-out; /* 定义过渡效果 */
}

.slide-leave-to {
  transform: translateX(-100%); /* 结束状态 */
}

.live2d-role {
  position: absolute;
  width: 20%;
  height: 30%;
  bottom: 10px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  overflow: hidden;
  overflow-x: auto;
  overflow-y: auto;
  padding: 10px;
}

/* live2D角色头像容器 */
.avatar-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 70%;
  height: 70%;
  min-width: 32px;
  min-height: 32px;
  max-width: 80px;
  max-height: 80px;
  border-radius: 50%;
  /* 圆角头像 */
  margin: 15px;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
}

.live2d-avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  /* 圆角头像 */
}

.active-avatar {
  transform: scale(1.1);
  /* 激活状态放大效果 */
  box-shadow: 0 0 10px rgba(71, 167, 235, .86);
}

/* 滚动条样式（根据需要进行调整） */
.live2d_role::-webkit-scrollbar {
  width: 8px;
}

.live2d_role::-webkit-scrollbar-thumb {
  background-color: #ccc;
  border-radius: 4px;
}

.live2d_role::-webkit-scrollbar-track {
  background-color: transparent;
}

/* 历史记录操作栏 */
.optionBox {
  display: flex;
}

.newChat {
  width: 60%;
}

/* 保存按钮 */
.save {
  width: 20%;
}

/* 按钮 */
.hiden {
  width: 20%;
}

.showList {
  position: absolute;
  z-index: 99;
}

.historyList {
  width: 20%;
  /* 调整历史记录区域宽度 */
  background-image: linear-gradient(to right, #c8fccd 0%, #dff8ff 100%);
  border-radius: 0px 0 0 0px;
  border: 0.5px solid #28df99;
  /* box-shadow: 0 3px 5px rgba(32, 160, 255, .5); */
  transition: width 0.3s ease-in-out;
}

.hidden {
  width: 0;
  border: 0px;
  transition: width 0.3s ease-in-out;
}

.historyItem {
  display: flex;
  width: 99%;
  height: 48px;
  max-height: 48px;
  background-image: linear-gradient(to right, #aeffb6 0%, #aeefff 100%);
  color: rgb(0, 0, 0);
  justify-content: center;
  align-items: center;
  /* 垂直居中 */
  border-bottom: 0.2px solid #28df99;
  white-space: nowrap;
  /* 不换行 */
  overflow: hidden;
  /* 超出部分隐藏 */
  text-overflow: ellipsis;
  /* 超出部分显示省略号 */
}

.historyItem:hover {
  background-image: linear-gradient(to right, #87ce8e 0%, #8ec1ce 100%);
  border: 0.5px solid #28df99;
  transform: translateX(20px);
  transition: transform 0.3s;
}

.historyItemActive {
  background-image: linear-gradient(to right, #81e28b 0%, #6fc0d4 100%);
  border: 0.5px solid #28df99;
  transform: translateX(0px);
  transition: background-image 0.5s ease, transform 0.5s;
}

.chat-container {
  background-color: var(--card-background);
  width: 100%;
  /* min-height: 100%; */
  max-height: 65%;
  background-color: #f5f5f5;
  /* border-radius: 10px; */
  /* box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2); */
  overflow: hidden;
  overflow-y: auto;
}

.messages {
  padding: 5px;
}

.message {
  padding-left: 38px;
  padding-right: 38px;
  white-space: pre-line;
  /* 固定其下copyicon */
  position: relative;
}

.user-message {
  /* 底部工具条 */
  margin-bottom: 32px;
  right: 0;
  background-color: #b5dd74;
  border-radius: 10px;
  padding: 10px;
  align-self: flex-start;
  width: fit-content;
  margin-left: auto;
}

.ai-message {
  background-color: #84cff0;
  border-radius: 10px;
  padding: 10px;
  align-self: flex-end;
  width: fit-content;
}

.user-textarea {
  position: absolute;
  /* 添加这行 */
  bottom: 30px;
  /* 调整底部间距 */
  left: 60%;
  /* 居中 */
  transform: translateX(-50%);
  /* 居中 */
  width: 80%;
  max-width: 600px;
  padding: 10px;
  border: none;
  border-radius: 10px;
  background-color: #ffffff;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  resize: none;
  font-size: 24px;

  opacity: 0.5;
  transition: opacity 0.3s ease-in-out;
}

.user-textarea:hover {
  opacity: 1;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  overflow: hidden;
}

.user-avatar {
  float: right;
  /* 将用户头像定位在左侧 */
}

.ai-avatar {
  float: left;
  /* 将AI头像定位在右侧 */
}

.loading-overlay {
  position: absolute;
  /* 添加这行 */
  bottom: 48px;
  /* 调整底部间距 */
  left: 75%;
  /* 居中 */
  transform: translateX(-50%);
  /* 居中 */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.loading-spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left: 4px solid #007bff;
  /* 加载动画的颜色 */
  border-radius: 50%;
  width: 24px;
  height: 24px;
  animation: spin 1s linear infinite;
  /* 使用动画效果使加载动画旋转 */
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

/* 信息复制按钮 */
.icon-copy-ai{
  position: absolute;
  margin-top: 10px;
  left: 34px;
  height: 32px;
  width: 32px;
  opacity: 0.6;
}

.icon-copy-ai:hover{
  height: 36px;
  width: 36px;
  opacity: 1;
  transition: opacity 0.3s ease-in-out;
}

.icon-copy-user{
  position: absolute;
  bottom: -34px;
  right: 34px;
  height: 32px;
  width: 32px;
  opacity: 0.6;
}

.icon-copy-user:hover{
  height: 36px;
  width: 36px;
  opacity: 1;
  transition: opacity 0.3s ease-in-out;
}

.audio-role{
  position: absolute;
  left: 64px;
}
</style>
