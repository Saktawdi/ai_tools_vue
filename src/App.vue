<template>
  <nav class="nav">
    <!-- 导航链接 -->
    <router-link :to="{ path: '/' }" :class="{ active: isActive('/') }">首页</router-link>
    <router-link :to="{ path: '/aichat' }" :class="{ active: isActive('/aichat') }">言随意转</router-link>
    <router-link :to="{ path: '/mdppt' }" :class="{ active: isActive('/mdppt') }">智构幻图</router-link>
    <router-link :to="{ path: '/aimusic' }" :class="{ active: isActive('/aimusic') }">智韵绘声</router-link>
    <div class="profile-container" @mouseover="showMenu" @mouseleave="hideMenu">
      <img :src='getUserData.avatar' alt="Avatar" class="homeAvatar" />
      <div v-if="isMenuVisible" class="menu">
        <span class="navusername">{{ getUserData.userName }}</span>
        <div class="menu-list">
          <ul>
            <li v-if="getUserData.userName === '游客'" @click="ToLogin">登录</li>
            <li v-if="getUserData.userName != '游客'" @click="ToUserCenter">个人</li>
            <li v-if="getUserData.userName != '游客'" @click="userOut">退出</li>
          </ul>
        </div>
      </div>
    </div>
  </nav>
  <router-view />
</template>

<script>
import { requestConfig } from "@/request";
import defaultHeadImg from "@/assets/default5.png";

export default {
  data() {
    return {
      baseUrl: requestConfig.baseURL1,
      isMenuVisible: false,
      userImgUrl: ''
    };
  },
  computed: {
    getToken() {
      return this.$store.state.token;
    },
    getUserData() {
      var userInfo = this.$store.getters.getUserInfo;
      if (userInfo && userInfo.userName != "游客" && !userInfo.avatar.startsWith(this.baseUrl)) {
        userInfo.avatar = this.baseUrl + userInfo.avatar;
      }
      return userInfo;
    }
  },
  methods: {
    isActive(route) {
      return this.$route.path === route;
    },
    showMenu() {
      this.isMenuVisible = true;
    },
    hideMenu() {
      this.isMenuVisible = false;
    },
    ToLogin() {
      this.$router.push("/login");
    },
    ToUserCenter() {
      this.$router.push("/userInfo");
    },
    async userOut() {
      await this.$store.dispatch('clearToken');
      localStorage.removeItem('token');
      await this.$store.dispatch("setUserInfo", {
        avatar: defaultHeadImg,
        userName: "游客",
        dept: {
          deptName: "游客"
        }
      });
      //刷新页面
      location.reload();
    }
  },
};
</script>

<style>
body {
  margin: 0;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

/* 活动链接样式 */
nav a.active {
  background-color: #3ead44;
  color: white;
}


nav {
  position: relative;
  height: 28px;
  background-image: linear-gradient(to right, #30cfd0 0%, #330867 100%);
  padding: 10px 0;
  text-align: center;
  z-index: 999;
}

/* 小圆点样式 */
nav::before,
nav::after{
  content: "";
  display: inline-block;
  vertical-align: middle;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #ccc;
  transition: transform 0.3s ease, background-color 0.3s ease;
}

/* 鼠标悬停时放大小圆点 */
nav:hover::before{
  transform: scale(1.5);
}
nav:hover::after {
  transform: scale(1.5);
}

/* 导航链接样式 */
nav a {
  color: white;
  text-decoration: none;
  margin: 0 10px;
  padding: 5px 10px;
  border-radius: 5px;
  transition: background-color 0.3s, color 0.3s;
}

/* 导航链接悬停效果 */
nav a:hover {
  background-color: #3ead44;
  color: white;
}


/* 移除第一个分隔符前的间隔 */
nav::before {
  margin-left: -10px;
}

/* 移除最后一个分隔符后的间隔 */
nav::after {
  margin-right: -10px;
}

.profile-container {
  width: 128px;
  position: absolute;
  top: 0;
  right: 0px;
}

.homeAvatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
}

.menu {
  width: 128px;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}

.navusername {
  font-weight: bold;
  font-size: 18px;
}

.menu-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.menu-list li {
  padding: 5px 10px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  font-size: 14px;
}

.menu-list li:hover {
  background-color: #f5f5f5;
}
</style>
