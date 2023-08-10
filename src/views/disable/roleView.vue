<template>
    <div class="intercept-container">
        <div class="intercept-content">
            <h1 class="intercept-title">Oops! {{ getUserData.userName }}</h1>
            <p class="intercept-description">很抱歉，您没有访问该页面的权限。</p>
            <router-link to="/login" class="intercept-link" v-if="getUserData.userName === '游客'">登录</router-link>
            <br>
            <br>
            <br>
            <router-link to="/" class="intercept-link">返回首页</router-link>
        </div>
    </div>
</template>
  
<script>
export default {
    computed: {
        getUserData() {
            return this.$store.getters.getUserInfo;
        }
    }
}
</script>
<style scoped>
.intercept-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 48px);
  background: linear-gradient(135deg, #ff6b6b, #3ca8fe);
  background-size: 200% 200%;
  animation: gradientAnimation 10s ease infinite;
  overflow: hidden;
}

@keyframes gradientAnimation {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.intercept-content {
  text-align: center;
  color: white;
}

.intercept-title {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.intercept-description {
  font-size: 1.5rem;
  margin-bottom: 2rem;
}

.intercept-link {
  background-color: #ffffff;
  color: #3ca8fe;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  text-decoration: none;
  font-weight: bold;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.intercept-link:hover {
  background-color: #3ca8fe;
  color: #ffffff;
}
</style>