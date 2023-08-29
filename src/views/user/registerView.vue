<template>
  <div class="register-container">
    <particleBackground></particleBackground>
    <div class="register-box">
      <h2 class="register-title">欢迎注册</h2>
      <form class="register-form" autocomplete="off" @submit.prevent="register">
        <div class="avatar-wrapper">
          <img class="avatar-img" id="avatarImg" :src='avatarUrl || avatar' alt="默认头像" @click="openFileInput">
          <input type="file" ref="fileInput" id="avatarFileInput" name="avatar" accept="image/*" @change="previewAvatar">
        </div>
        <div class="input-group">
          <label for="username">用户名</label>
          <input type="text" id="username" v-model="username" />
        </div>
        <div class="input-group">
          <label for="email">邮箱</label>
          <input type="email" id="email" v-model="email" />
        </div>
        <div class="input-group">
          <label for="password">密码</label>
          <input type="password" id="password" v-model="password" />
        </div>
        <button class="register-button" type="submit">注册</button>
      </form>
    </div>
  </div>
</template>

<script>
import particleBackground from "@/components/particleBackground.vue";
import defaultHeadImg from "@/assets/default5.png";
import { registerApi, uploadAvatar } from "@/api/getUser";
import { showAlter } from '@/utils/showAlter';
import { requestConfig } from "@/request";

export default {
  components: {
    particleBackground
  },
  data() {
    return {
      avatar: defaultHeadImg,//文件
      baseURL: requestConfig.baseURL1,
      avatarUrl: '',//回显的头像地址
      uploadedUrl:'',//注册提交的上传的头像地址,防止重复上传
      username: '',
      email: '',
      password: ''
    };
  },
  methods: {
    //打开选择头像
    openFileInput() {
      this.$refs.fileInput.click();
    },
    //回显头像
    previewAvatar(event) {
      const file = event.target.files[0];
      if (!file) {
        this.avatar = defaultHeadImg;
        this.avatarUrl = '';
        this.uploadedUrl = '';
        return;
      }
      this.avatar = file;
      // 使用FileReader对象预览图片
      const reader = new FileReader();
      reader.onload = (e) => {
        this.avatarUrl = e.target.result;
      };
      reader.readAsDataURL(this.avatar);
    },
    async register() {
      if (this.username.trim() === '' || this.email.trim() === '' || this.password.trim() === '') {
        showAlter("请输入完整捏~~(￣▽￣)~*", 0);
        return;
      }
      let uploadRes;
      if (this.avatarUrl && !this.uploadedUrl && (this.baseURL + this.uploadedUrl) != this.avatarUrl) {
        uploadRes = await uploadAvatar(this.avatar);
        if (uploadRes.data.code === 0) {
          this.avatarUrl = this.baseURL + uploadRes.data.fileName;
          this.uploadedUrl = uploadRes.data.fileName;
        } else {
          showAlter("上传头像失败，请重试一次吧~", 0)
          return;
        }
      } else if(this.uploadedUrl){
        //默认头像
        this.avatarUrl = '';
      }else{
        this.uploadedUrl = '/profile/upload/2023/08/14/default5_20230814150801A002.png';
      }
      const registerRes = await registerApi(this.username, this.email, this.uploadedUrl, this.password)
      if (registerRes.data.code === 0) {
        showAlter("恭喜，注册成功！欢迎加入~", 1)
        this.$router.push('/login');
      } else {
        showAlter(`注册失败了啊哦.\n ${registerRes.data.msg}`, 0);
      }
    }
  }
};
</script>

<style scoped>
.register-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 48px);
}

.register-box {
  position: relative;
  z-index: 2;
}

.register-title {
  font-size: 24px;
  margin-bottom: 20px;
  color: rgb(255, 255, 255);
}

.register-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fff;
  padding: 50px;
  border-radius: 8px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
}

.input-group {
  margin-bottom: 15px;
  width: 100%;
  text-align: left;
}

label {
  font-size: 14px;
  color: #555;
  margin-bottom: 5px;
}

input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 30px;
}

.register-button {
  margin-top: 10px;
  background-color: #007bff;
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  transition: background-color 0.3s;
  width: 80%;
}

.register-button:hover {
  background-color: #0056b3;
}

#avatarFileInput {
  display: none;
}

.avatar-img{
  height:128px;
  width: 128px;
  border-radius: 64px;
}
</style>
