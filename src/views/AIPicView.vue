<template>
    <div class="AIPic-container">
        <particleBackground></particleBackground>
        <div class="ai-drawing-app">
            <form @submit.prevent="generateImage">
                <div class="input-group">
                    <label for="prompt">Prompt</label>
                    <textarea ref="textarea" v-model="parameters.prompt" class="input-group  textarea-aipic"
                        :style="{ 'height': textareaHeight }"></textarea>
                </div>

                <div class="input-group">
                    <label for="negative-prompt">Negative Prompt</label>
                    <input type="text" id="negative-prompt" v-model="parameters.negative_prompt"
                        placeholder="Things to avoid in the image">
                </div>

                <div class="input-group">
                    <label for="width">Width</label>
                    <select id="width" v-model="parameters.width">
                        <!-- options generated from allowedValues -->
                        <option v-for="value in allowedValues" :key="value" :value="value">{{ value }}</option>
                    </select>
                </div>

                <div class="input-group">
                    <label for="height">Height</label>
                    <select id="height" v-model="parameters.height">
                        <!-- options generated from allowedValues -->
                        <option v-for="value in allowedValues" :key="value" :value="value">{{ value }}</option>
                    </select>
                </div>

                <div class="input-group">
                    <label for="num-inference-steps">Number of Inference Steps</label>
                    <input type="number" id="num-inference-steps" v-model="parameters.num_inference_steps">
                </div>

                <div class="input-group">
                    <label for="num-inference-steps-prior">Number of Inference Steps for Priors</label>
                    <input type="number" id="num-inference-steps-prior" v-model="parameters.num_inference_steps_prior">
                </div>

                <div class="input-group">
                    <label for="num-outputs">Number of Outputs</label>
                    <input type="number" id="num-outputs" v-model="parameters.num_outputs">
                </div>

                <div class="input-group">
                    <label for="seed">Seed</label>
                    <input type="number" id="seed" v-model="parameters.seed" placeholder="Random seed">
                </div>

                <button class="btn-generate" type="submit">Generate</button>
            </form>
            <div class="output-area">
                <img :src="imageSrc" alt="AI generated outcome" class="img-showRes">
                <button @click="downloadImage">Download</button>
            </div>
        </div>
    </div>
</template>
  
<script>
import particleBackground from "@/components/particleBackground.vue";
import calcTextareaHeight from '@/utils/calcTextareaHeight';

export default {
    components: {
        particleBackground
    },
    watch: {
        'parameters.prompt'(newVal, oldVal) {
            console.log(newVal,oldVal)
            this.autoExpandTextarea();
        }
    },
    data() {
        return {
            textareaHeight: '32px',
            parameters: {
                prompt: 'A moss covered astronaut with a black background',
                negative_prompt: '',
                width: 512,
                height: 512,
                num_inference_steps: 75,
                num_inference_steps_prior: 25,
                num_outputs: 1,
                seed: ''
            },
            allowedValues: [384, 512, 576, 640, 704, 768, 960, 1024, 1152, 1280, 1536, 1792, 2048],
            imageSrc: 'https://replicate.delivery/pbxt/Lca3IEjcKoJBBVS6ajROkK37sDzPsmjYxIcFzxPZp65wZzTE/out-0.png' // This will hold the generated image source
        };
    },
    methods: {
        //自适应输入框高度
        autoExpandTextarea() {
            this.textareaHeight = calcTextareaHeight(this.$refs.textarea, 1, 7).height;
        },
        generateImage() {
            // You will need to implement the logic to generate an image based on the parameters
            console.log('Generating Image with these parameters:', this.parameters);
            // For now, we'll just simulate an image source
            this.imageSrc = 'path_to_generated_image.jpg';
        },
        downloadImage() {
            // You will need to implement the logic to download the image
            console.log('Downloading Image');
        },

    }
}
</script>
  
<style>
.AIPic-container {
    display: flex;
    justify-content: space-around;
    align-items: center;
    height: calc(100vh - 48px);
    /* background-color: #3949ab; */
}

.ai-drawing-app {
    display: flex;
    /* justify-content: space-between; */
    max-width: 1200px;
    max-height: 90%;
    margin: auto;
    padding: 20px;
    box-sizing: border-box;
    background-color: rgba(255, 255, 255, 0.1);
    color: #fff;
    border-radius: 15px;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
    overflow: hidden;
}

form{
    width: 40%;
}

.input-group {
    display: flex;
    flex-direction: column;
    margin-bottom: 15px;
    /* width: 150%; */
}

.input-group label {
    font-weight: bold;
    margin-bottom: 5px;
}

.input-group input,
.input-group select {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
}

/* 突出显示 prompt 输入框 */
.textarea-aipic {
    border: 2px solid #4caf50;
    resize: none;
    max-width: 100%;
}

.output-area {
    display: flex;
    flex: 1;
    text-align: center;
    margin-left: 20px;
    flex-direction: column;
    max-width: 60%;
}

.output-area img {
    max-width: 100%;
    height: 80%;
    border: 1px solid #ddd;
    /* Light grey border */
    margin-bottom: 15px;
    margin-top: 20px;
}

button {
    padding: 10px 20px;
    font-size: 16px;
    color: #fff;
    background-color: #5c6bc0;
    /* Indigo background */
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
}

button:hover {
    background-color: #3949ab;
    /* Darker indigo background */
}

.btn-generate{
    width: 100%;
}

@media (max-width: 768px) {
    .ai-drawing-app {
        flex-direction: column;
    }

    .output-area {
        margin-left: 0;
        margin-top: 20px;
    }
}
</style>
  
  