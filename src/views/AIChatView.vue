<template>
  <div class="AIChat">
    <div class="historyList">
      <div class="optionBox">
        <button class="newChat button" @click="createNewChat">
          <img src="../assets/add.svg" alt="新建" class="add-icon" style="width:15px;" />
          新聊天
        </button>
        <button class="save button" @click="saveChatHistory">
          <img src="../assets/save.svg" alt="保存" class="add-icon" style="width:15px;" />
          保存
        </button>
      </div>
      <div v-for="historyItem in chatHistoryItems" :key="historyItem.id"
        :class="{ 'historyItem': true, 'historyItemActive': historyItem.isActive }" @click="activateHistoryItem(historyItem.id)">
        <span>{{ historyItem.name }}</span>
        <img class="delete-icon" @click="deleteHistoryItem(historyItem.id)" src="../assets/delete.svg" alt="Delete Icon"
          style="margin-right:15px;width:28px;" />
      </div>
    </div>
    <div class="chat-container">
      <div class="messagesBox">
        <div v-for="(message, index) in nowChatHistory" :key="index" class="messages">
          <div class="avatar" :class="{ 'user-avatar': message.fromUser, 'ai-avatar': !message.fromUser }">
            <img :src="message.avatar" alt="Avatar" class="avatar" />
          </div>
          <div class="message">
            <div :class="{ 'user-message': message.fromUser, 'ai-message': !message.fromUser }">
              {{ message.content }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- <input v-model="userInput" @keydown.enter="sendMessage" class="user-input" placeholder="畅你所言" /> -->
    <textarea ref="textarea" v-model="userInput" @keydown.enter="handleEnterKey" class="user-textarea" placeholder="畅你所言" :style="{'height': textareaHeight}"></textarea>
  </div>
</template>

<script>
import calcTextareaHeight from '@/utils/calcTextareaHeight';
import { showAlter } from "@/utils/showAlter";

export default {
  data() {
    return {
      chatHistory: [], // 存放聊天历史
      nowChatHistory: [],// 现在条目的历史记录
      chatHistoryItems: [
        { id: 1, name: 'Chat 1', isActive: false },
        { id: 2, name: 'Chat 2', isActive: false },
        { id: 3, name: 'Chat 3', isActive: false },
      ],//历史聊天条目
      userInput: '',   // 用户输入
      textareaHeight:'24px',
    };
  },
  mounted(){
    var userInfo  = this.$store.getters.getUserInfo;
    if(userInfo.userName === "游客"){
      this.$router.push('/roleDisable')
    }
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
    sendMessage() {
      if(this.userInput === ""){
        showAlter("请输入内容！亲",99);
        return;
      }
      if (this.nowChatHistory.length === 0) {
        const newItem = { id: Date.now(), name: this.userInput, isActive: true };
        this.chatHistoryItems.push(newItem);
      }
      // 将用户输入添加到当前历史记录数组
      const userMessage = {
        content: this.userInput,
        avatar: "https://cdn.jsdelivr.net/gh/Saktawdi/my-images@main/img/logo.png",
        fromUser: true,
      };
      this.nowChatHistory.push(userMessage);
      // TODO: 调用 AI 进行回复，将 AI 回复添加到 chatHistory 中
      this.userInput = ''; // 清空用户输入
      // 模拟 AI 的回复
      setTimeout(() => {
        const aiMessage = {
          content: '这是 AI 发送的信息',
          avatar: "https://cdn.jsdelivr.net/gh/Saktawdi/my-images@main/img/%E5%9B%BE%E7%89%87%20(2).jpg",
          fromUser: false,
        };
        this.nowChatHistory.push(aiMessage);
      }, 1000); // 1秒后添加 AI 的回复
    },
    // 删除历史记录
    deleteHistoryItem(id) {
      const index = this.chatHistoryItems.findIndex(item => item.id === id);
      if (index !== -1) {
        // 删除 chatHistoryItems 中的项
        this.chatHistoryItems.splice(index, 1);

        // 清空 nowChatHistory
        this.nowChatHistory = [];

        // 删除 chatHistory 中的对应项
        const chatHistoryIndex = this.chatHistory.findIndex(item => item.id === id);
        if (chatHistoryIndex !== -1) {
          this.chatHistory.splice(chatHistoryIndex, 1);
        }
      }
    },
    // 激活历史记录
    activateHistoryItem(id) {
      const index = this.chatHistoryItems.findIndex(item => item.id === id);
      if (index !== -1) {
        this.chatHistoryItems.forEach((item, i) => {
          item.isActive = i === index;
        });
        // 根据激活的历史记录项，更新当前的聊天记录
        const activeHistory = this.chatHistory.find(item => item.item === this.chatHistoryItems[index].name);
        if (activeHistory) {
          this.nowChatHistory = activeHistory.data;
        } else {
          this.nowChatHistory = [];
        }
      }
    },
    // 新建聊天
    createNewChat() {
      if(this.nowChatHistory.length === 0){
        showAlter("直接按回车键发信息即可了哦~",99);
        return;
      }
      let itemTemp;
      this.chatHistoryItems.forEach((item) => {
        if (item.isActive === true) {
          itemTemp = item;
          item.isActive = false;
        }
      });
      this.chatHistory.push({id:itemTemp.id,item: itemTemp.name, data: this.nowChatHistory });
      this.nowChatHistory = [];
    },
    //保存历史记录
    saveChatHistory() {
      localStorage.setItem('chatHistory', JSON.stringify(this.chatHistory));
      showAlter("保存成功",1);
    },
    // TODO: 实现调用 AI 的方法，获取 AI 的回复，并将回复添加到 chatHistory 中
  },
};
</script>

<style>
/* 主题色 */
:root {
  --primary-color: #3498db; /* 蓝色 */
  --secondary-color: #e74c3c; /* 红色 */
  --background-color: #f5f5f5; /* 浅灰背景色 */
  --card-background: #ffffff; /* 卡片背景色 */
  --text-color: #333333; /* 文本颜色 */
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
  border-radius: 0px;
  width: 100%;
  max-height: 32px;
}

.optionBox{
  display: flex;
}

.newChat {
  max-width: 70%;
}
/* 保存按钮 */
.save{
  max-width:30%;
}

.historyList {
  width: 20%;
  /* 调整历史记录区域宽度 */
  background-image: linear-gradient(to right, #c8fccd 0%, #dff8ff 100%);
  border-radius: 0px 0 0 0px;
  /* border: 0.5px solid #28df99; */
  box-shadow: 0 3px 5px rgba(32,160,255,.5);
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
  white-space: nowrap; /* 不换行 */
  overflow: hidden; /* 超出部分隐藏 */
  text-overflow: ellipsis; /* 超出部分显示省略号 */
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
  min-height: 100%;
  max-height: 100%;
  background-color: #f5f5f5;
  /* border-radius: 10px; */
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  overflow-y: scroll;
}

.messages {
  padding: 5px;
}

.message {
  padding-left: 38px;
  padding-right: 38px;
  white-space: pre-line;
}

.user-message {
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
</style>
