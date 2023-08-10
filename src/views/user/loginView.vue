<template>
  <div class="login-container">
    <div class="background-blur"></div>
    <div class="login-box">
      <h2 class="login-title">欢迎登录</h2>
      <form class="login-form" @submit="login">
        <label for="username">用户名</label>
        <input type="text" id="username" v-model="username" />
        <label for="password">密码</label>
        <input type="password" id="password" v-model="password" />
        <button class="login-button" type="submit">登录</button>
        <a @click="ToRegister">没有账户？点我注册</a>
      </form>
    </div>
    <div class="img-show">
      <img class="logo" src="../../assets/logo.png" />
    </div>
  </div>
</template>

<script>
import { loginApi } from "@/api/getUser";
import { showAlter } from "@/utils/showAlter";

export default {
  data() {
    return {
      username: '',
      password: '',
    };
  },
  mounted(){
    if(this.$store.state.token){
      this.$router.push({ path: '/userInfo' });
    }
  },
  methods: {
    async login(e) {
      e.preventDefault();
      if(this.username === "" || this.password ===""){
        showAlter("请输入完整！",0);
        return;
      }
      await loginApi(this.username, this.password).then(
        res => {
          if (res.data.code === 0) {
            localStorage.setItem('token', res.data.token)
            this.$store.dispatch('setToken',res.data.token)

            location.reload()
          } else {
            showAlter(`登录失败了哦~\n${res.data.msg}`,0);
          }
        }
      )
    },
    ToRegister(){
      this.$router.push("/register");
    },
  },
};
</script>

<style scoped>
.login-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 48px);
  overflow: hidden;
}

.background-blur {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url("../../assets/background.png");
  filter: blur(10px); /* 调整高斯模糊程度 */
  z-index: -1;
}

.login-box {
  background-color: #ffffff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 600px;
  height: 300px;
  text-align: center;
  z-index: 1;
}

.login-title {
  margin-bottom: 20px;
}

.login-form{
  display: flex;
  flex-direction: column;
  align-items: center;
}

.login-form label {
  display: block;
  margin-bottom: 6px;
}

.login-form input {
  width: 100%;
  max-width: 60%;
  padding: 8px;
  margin-bottom: 12px;
  border: 1px solid #ccc;
  border-radius: 30px;
  font-size: 18px;
}

.login-button {
  margin-top: 5%;
  min-width: 60%;
  background-color: #007bff;
  color: #ffffff;
  border: none;
  border-radius: 30px;
  padding: 8px 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.login-button:hover {
  background-color: #0056b3;
}

.img-show {
  margin-left:200px;
  border-radius: 30px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  /* flex: 1; */
  z-index: 1;
}

.logo {
  max-width: 100%;
  max-height: 100%;
}

</style>
