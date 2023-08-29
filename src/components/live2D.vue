<template>
    <div class="live2DBox">
    <canvas id="canvas_view"></canvas>
    </div>
</template>

<script>
import { init,playIdle,playTalk } from './index'
export default {
    props: {
        url: String,
        height: String,
        width: String,
        scale: Number,
        x:Number,
        ideaAc:String,
        talkAc: {
            type: Array,
            default: () => []
        }
    },
    data(){
        return{
            model:null
        }
    },
    mounted(){
        this.initLive2D();
    },
    methods:{
        async initLive2D() {
           this.model = await init(this.url, this.height, this.width, this.scale,this.x, false);
           this.model.internalModel.motionManager.state.reset();
           this.loadIdle();
        },
        loadIdle(){
            playIdle(this.model,this.ideaAc);
        },
        loadTalk(){
            const randomIndex = Math.floor(Math.random() * this.talkAc.length);
            const randomValue = this.talkAc[randomIndex];
            playTalk(this.model,randomValue);
        }
    }
}
</script>

<style>
.live2DBox{
    position:absolute;
    bottom: 0px;
    left: 20%;
    z-index: 9999;
}
</style>