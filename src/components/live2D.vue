<template>
    <div class="live2DBox">
        <canvas id="canvas_view"></canvas>
    </div>
</template>

<script>
import { init, playIdle, playTalk } from './index'
export default {
    props: {
        url: String,
        height: String,
        width: String,
        scale: Number,
        x: Number,
        ideaAc: String,
        talkAc: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            model: null
        }
    },
    mounted() {
        this.initLive2D();
    },
    methods: {
        async initLive2D() {
            try {
                var height = this.height * (window.innerHeight / 1001);
                var width = this.width * (window.innerWidth / 1872);
                var scale = this.scale * (window.innerWidth / 1872);
                var x = this.x * (window.innerWidth / 1872);
                this.model = await init(this.url, height, width, scale, x, false);
                this.model.internalModel.motionManager.state.reset();
                this.loadIdle();
            } catch (error) {
                console.log("live2D初始化错误：", error);
            }
        },
        loadIdle() {
            playIdle(this.model, this.ideaAc);
        },
        loadTalk() {
            const randomIndex = Math.floor(Math.random() * this.talkAc.length);
            const randomValue = this.talkAc[randomIndex];
            playTalk(this.model, randomValue);
        }
    }
}
</script>

<style>
.live2DBox {
    
}
</style>