<template>
  <div class="home">
    <particleBackground></particleBackground>
    <div class="part1">
      <div class="header">
        <img alt="Logo" src="../assets/logo.png" class="logo">
        <h1 class="title">AI智能多彩角</h1>
        <p class="tagline">在AI智能多彩角，探索无限创意，畅享AI的魔幻世界！</p>
      </div>
      <div class="features">
        <div class="feature" @click="TOAichat">
          <img src="../assets/AIAvatar.jpg" alt="Chat Icon" class="feature-icon">
          <h2 class="feature-title">言随意转</h2>
          <p class="feature-description">与具有各种性格特点的AI进行有趣的语音对话并互动，在轻松的氛围下解决疑问</p>
        </div>
        <div class="feature" @click="TOMdppt">
          <img src="../assets/pptAvatar.jpg" alt="PPT Icon" class="feature-icon">
          <h2 class="feature-title">智构幻图</h2>
          <p class="feature-description">让AI帮您生成炫酷的PPT，节省时间与精力</p>
        </div>
        <div class="feature" @click="TOAiMusic">
          <img src="../assets/MusicAvatar.jpg" alt="Music Icon" class="feature-icon">
          <h2 class="feature-title">智韵绘声</h2>
          <p class="feature-description">智韵绘声，音乐从心开始</p>
        </div>
      </div>
      <div class="cta">
        <p class="cta-text">体验智能AI的魔力，解锁无限可能！</p>
        <router-link to="/aichat" class="cta-button">开始聊天</router-link>
      </div>
    </div>
    <div class="part2">
      <div class="free-section">
        <h2 class="section-title">免费使用</h2>
        <p class="section-description">致力于为您提供免费的AI助手服务，让您的体验更加畅享。</p>
      </div>
      <div class="love-section">
        <h2 class="section-title">用爱发电</h2>
        <p class="section-description">网站由@Sakta_wdi打造，努力用爱发电中...
          <br>出于成本问题，目前可用机器人五个，意味着同时间只能有五个人问答
          <br>未来视情况增设机器人</p>
        <span class="donation-description">如果您觉得好用的话，不妨请作者喝杯快乐水~~~让作者爆肝更新！</span>
        <img src="../assets/donation.jpg" alt="Heart Icon" class="heart-icon">
      </div>
    </div>
    <div class="footer">
      <div class="statement-section">
        <h2 class="footer-title">免责声明:</h2>
        <span class="footer-description">本站仅供学习参考使用，请勿用于违法活动！</span>
      </div>
      <div>
        ©2023 sakta_wdi版权所有。
        <br>
        备案号：<a href="https://beian.miit.gov.cn">粤ICP备2023096562号-1</a>
      </div>
    </div>
  </div>
</template>

<script>
import particleBackground from "@/components/particleBackground.vue";

export default {
  components:{
        particleBackground
  },
  mounted() {
  },
  methods: {
    TOAichat(){
      this.$router.push('/aichat');
    },
    TOMdppt(){
      this.$router.push('/mdppt');
    },
    TOAiMusic(){
      this.$router.push('/aimusic');
    }
  }
}
</script>

<style scoped>
a{
  color: #243a49;
}
.home {
  text-align: center;
  padding: 50px 0;
}

.part1 {
  position: relative;
  width: 100%;
  height: calc(100vh - 48px);
  z-index: 2;
}

.header {
  margin-bottom: 30px;
}

.logo {
  width: 100px;
  height: 100px;
}

.title {
  font-size: 28px;
  margin: 20px 0;
  color: #ffffff;
}

.tagline {
  font-size: 18px;
  color: #dbdbdb;
}

.features {
  display: flex;
  justify-content: center;
  margin: 50px 0;
}

.feature {
  flex: 1;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 10px;
  margin: 0 10px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
}

.feature:hover {
  transform: translateY(-10px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.feature-icon {
  width: 60px;
  height: 60px;
}

.feature-title {
  font-size: 24px;
  margin: 10px 0;
  color:#ffffff
}

.feature-description {
  font-size: 16px;
  color: rgb(228, 228, 228);
}

.cta {
  margin-top: 50px;
}

.cta-text {
  font-size: 20px;
  margin-bottom: 20px;
  color: #ffffff;
}

.cta-button {
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 18px;
  text-decoration: none;
  transition: background-color 0.3s ease;
}

.cta-button:hover {
  background-color: #0056b3;
}

.part2 {
  position: relative;
  background-image: linear-gradient(-20deg, #2b5876 0%, #4e4376 100%);
  padding: 50px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 2;
}

.section-title {
  font-size: 28px;
  margin-bottom: 20px;
  color: rgb(255, 255, 255);
  text-align: center;
}

.section-description {
  font-size: 18px;
  color: rgb(214, 214, 214);
  margin-bottom: 40px;
  max-width: 600px;
  text-align: center;
}

.love-section {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.heart-icon{
  max-height: 256px;
}

.donation-description{
  padding: 10px;
  color:#c5c5c5
}

.footer{
  position: relative;
  z-index: 2;
}
</style>
