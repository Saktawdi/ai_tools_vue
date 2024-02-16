<template>
  <div class="particle-background">
    <canvas id= "canvas" ref="canvas" :width="wid" :height="hei"></canvas>
  </div>
</template>
  
<script>
import { init,start } from "@/assets/particle/cover.js";
export default {
  data() {
    return {
      wid: null,
      hei: null,
      ctx:{}
    }
  },
  created() {
    // 设置 Canvas 宽高为窗口的宽高
    this.wid = window.innerWidth;
    this.hei = window.innerHeight;
  },
  mounted() {
    this.initCanvas();
  },
  methods: {
    initCanvas() {
      console.log("初始化canvas");
      const canvas = document.querySelector("#canvas");
      canvas.width = document.documentElement.clientWidth;
      canvas.height = document.documentElement.clientHeight;
      this.ctx = canvas.getContext("2d");
      init(this.ctx, canvas.width, canvas.height);
      start();
    },
  },
};
</script>
  
<style scoped>
.particle-background {
  position: fixed;
  background-image: linear-gradient(-20deg, #2b5876 0%, #4e4376 100%);
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}
</style>
  