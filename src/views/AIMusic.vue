<template>
    <div class="AIMusic-container">
        <particleBackground></particleBackground>
        <div class="card input-card" :class="{ 'active-card': activeCard === 'input' }">
            <!-- 显示进度条和进度百分比 -->
            <div class="option-box" v-if="processing || starting">
                <h1 v-if="starting">正在初始化...</h1>
                <p style="margin:20px">{{ tip[tipRandomIndex] }}</p>
                <div class="star-container">
                    <div class="star"></div>
                </div>
                <progress class="musicGenerate-progress" :value="progress * 100" max="100" v-if="processing"></progress>
                <p class="progress-text" v-if="processing">{{ progress }}%</p>
            </div>
            <div class="option-box" v-else>
                <!-- 参数输入框 -->
                <div class="input-text-container">
                    <textarea ref="textarea" v-model="userText" class="user-textarea-prompt"
                        :placeholder="exampleText[randomIndex]" :style="{ 'height': textareaHeight }"></textarea>
                    <img src="../assets/random.svg" alt="随机" class="random-icon" style="width:32px;" @click="randomSample"/>
                </div>
                <!-- 生成秒数滑块 -->
                <div class="slider-container">
                    <input type="range" min="8" max="30" class="time-slider" v-model="timeInSeconds" />
                    <p class="slider-value">{{ timeInSeconds }} 秒</p>
                </div>
                <button class="generate-button" @click="generateMusic()">生成</button>
            </div>
        </div>
        <div class="card output-card" :class="{ 'active-card': activeCard === 'output' }">
            <!-- 输出音频内容 -->
            <div ref="audioContainer" class="audioContainer">
                <audio ref="audio" controls class="audio-player" src="../assets/audio/exame1.wav">
                    Your browser does not support the audio element.
                </audio>
            </div>
            <div ref="wavesurferContainer" id="wavesurfer">
            </div>
        </div>
        <div class="fm">
            <canvas ref="canvas" style="height:30%"></canvas>
        </div>
    </div>
</template>
  
<script>
import WaveSurfer from 'wavesurfer.js';
import particleBackground from "@/components/particleBackground.vue";
import { requestConfig } from "@/utils/request";
import { showAlter } from "@/utils/showAlter";
import { v4 as uuidv4 } from 'uuid';
import calcTextareaHeight from '@/utils/calcTextareaHeight';
import { tip,examplePromet } from "@/api/musicPromptData";


export default {
    components: {
        particleBackground
    },
    data() {
        return {
            exampleText: examplePromet,
            randomIndex: 0,
            tip:tip,
            tipRandomIndex:0,
            textareaHeight: '32px',
            activeCard: 'input',
            timeInSeconds: 8,
            tempData: "r8_BHsqraUTBbdS9ysDFMWeeUmYyJZvQkT0ev78E",
            userText: "",//用户输入的参数
            processing: false,
            starting: false,
            completed: false,
            progress: 0.00, //生成进度
            isPlaying: false, // 波纹效果
            rippleAmplitude: 7, // 横线坐标,-相关
            rippleFrequency: 0.01,//频率
            rippleSpeed: 0.001, //震动速度
            audioContext: null,
            analyser: null,
            source: null,
            audioElement: null,
            wavesurfer: null,
        };
    },
    mounted() {
        var userInfo = this.$store.getters.getUserInfo;
        if (userInfo.userName === "游客") {
            this.$router.push('/roleDisable')
        }
        this.randomIndex = Math.floor(Math.random() * this.exampleText.length);
        const audioElement = this.$refs.audio;
        audioElement.src = require(`../assets/audio/exame${this.randomIndex + 1}.wav`);
        this.audioElement = audioElement;
        this.initAudio();
    },
    computed: {
        getUserData() {
            var userInfo = this.$store.getters.getUserInfo;
            return userInfo;
        },
        getToken() {
            return this.$store.state.token;
        },
    },
    watch: {
        userText() {
            this.autoExpandTextarea();
        }
    },
    methods: {
        //自适应输入框高度
        autoExpandTextarea() {
            this.textareaHeight = calcTextareaHeight(this.$refs.textarea, 1, 7).height;
        },
        //随机示例
        randomSample(){
            this.userText = "";
            this.randomIndex = Math.floor(Math.random() * this.exampleText.length);
            this.audioElement.src = require(`../assets/audio/exame${this.randomIndex + 1}.wav`);
        },
        reLoadAudioElement(src) {
            // 获取音频容器
            const audioContainer = this.$refs.audioContainer;
            // 获取wavefuer容器
            const wavesurferContainer = this.$refs.wavesurferContainer;
            //删除
            wavesurferContainer.innerHTML = "";
            // 创建新的 audio 元素
            const newAudioElement = document.createElement('audio');
            newAudioElement.className = "audio-player";
            newAudioElement.crossOrigin = 'anonymous';
            newAudioElement.controls = true;
            newAudioElement.src = src;
            // 删除旧的 audio 元素
            const oldAudioElement = audioContainer.querySelector('audio');
            if (oldAudioElement) {
                audioContainer.removeChild(oldAudioElement);
            }
            // 将新的 audio 元素插入到容器中
            audioContainer.appendChild(newAudioElement);
            this.audioElement = newAudioElement;
            this.initAudio();
        },
        async generateMusic() {
            this.activateCard('output');
            if (this.userText === "") {
                this.userText = this.exampleText[this.randomIndex];
            }
            // const alterInstance = showAlter("请耐心等待，正在全速前进地生成音乐！", 5)
            this.starting = true;
            this.completed = false;
            // Step 1: Call the first API to convert user input to AI prompt
            const response1 = await fetch(`${requestConfig.baseURL1}/v1/chat/pri/send`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "token": this.getToken
                },
                body: JSON.stringify({
                    model: "gpt-3.5-turbo-16k",
                    messages: [{
                        "role": "system",
                        "content": "。你是一个可靠的助手，将尽力帮助用户完成目标。你现在需要将用户的词语转变为英语，可以适当的进行定语修饰和乐理方面上的润色"
                    }, { role: "user", content: this.userText }],
                    temperature: 1,
                    stream: false
                })
            });
            if (response1.status === 500) {
                // alterInstance.close();
                this.starting = false;
                showAlter("AI服务器异常，请稍后再试")
                return;
            }
            if (response1.status === 404) {
                // alterInstance.close();
                this.starting = false;
                showAlter("AI服务器正在维护中，请留意公告通知，耐心等待哦~")
                return;
            }
            const data1 = await response1.json();

            const aiResponse = data1.choices[0].message.content;
            const randomUUID = uuidv4();

            // Step 2: Call the second API to generate music based on AI response
            var predictionId = "";
            try {
                const response2 = await this.postPrompt(aiResponse, randomUUID);
                const data2 = await response2.json();
                predictionId = data2.id;
            } catch (error) {
                console.log("发送给模型失败：", error)
                showAlter("发送给模型失败")
                // alterInstance.close();
                this.starting = false;
                return;
            }
            if (!predictionId) {
                return;
            }
            // Step 3: Poll the third API to check if music generation is completed
            this.startPolling(predictionId);
        },
        async postPrompt(aiContent, randomUUID) {
            const requestBody = {
                version: "b05b1dff1d8c6dc63d14b0cdb42135378dcb87f6373b0d3d341ede46e59e2b38",
                input: {
                    model_version: "stereo-large",
                    prompt: aiContent,
                    duration:  this.timeInSeconds
                }
            };
            const output = await fetch('/v1/predictions', {
                method: 'POST',
                headers: {
                    "X-Authorization": "Token " + randomUUID,
                    "Authorization": "Token r8_EyxOUddJe66G3vFdE005oHyDIQYX2Mo29bbVw",
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });
            return output;
        },
        async checkStatus(predictionId) {
            const response = await fetch(`/v1/predictions/${predictionId}`,
            {
                method:'GET',
                headers: {
                    "Authorization": "Token r8_EyxOUddJe66G3vFdE005oHyDIQYX2Mo29bbVw"
                }
            });
            const data = await response.json();
            if (data.status === "succeeded") {
                // 音乐生成完成
                this.completed = true;
                this.processing = false;
                this.starting = false;
                this.reLoadAudioElement(data.output);
                // this.$refs.audio.src = data.output;
            } else if (data.status === "starting") {
                // 正在初始化
                this.starting = true;
                this.processing = false;
                this.completed = false;
            } else if (data.status === "processing") {
                // 生成中，更新进度
                this.processing = true;
                this.starting = false;
                this.completed = false;
                // 从 logs 中提取进度信息
                const logs = data.logs;
                // 从 logs 字符串中提取出最后一组进度信息
                const lastProgress = logs.match(/(\d+)\s+\/\s+(\d+)\s*$/);
                if (lastProgress) {
                    const currentProgress = parseInt(lastProgress[1]);
                    const totalProgress = parseInt(lastProgress[2]);
                    const percentage = (currentProgress / totalProgress) * 100;
                    console.log(`当前进度: ${currentProgress} / ${totalProgress}`);
                    console.log(`百分比: ${percentage.toFixed(2)}%`);
                    this.progress = percentage.toFixed(2);
                }
            } else {
                // 其他状态
                this.processing = false;
                this.starting = false;
                this.completed = false;
            }
        },
        async startPolling(predictionId) {
            this.checkStatus(predictionId); // 先获取一次状态
            const pollingInterval = 2000; // 5秒轮询一次
            this.pollingTimer = setInterval(() => {
                this.checkStatus(predictionId);
                if (this.completed) {
                    showAlter("生成成功，快去听一下吧！", 2);
                    clearInterval(this.pollingTimer); // 音乐生成完成，停止轮询
                }
            }, pollingInterval);
            this.pollingTimer1 = setInterval(() => {
                this.tipRandomIndex = Math.floor(Math.random() * this.tip.length);
                if (this.completed) {
                    clearInterval(this.pollingTimer1); // 音乐生成完成，停止轮询
                }
            }, 5000);
        },
        initAudio() {
            if (this.analyser) {
                // 如果之前已经初始化过，先断开连接
                this.analyser.disconnect();
                this.analyser = null;
                if (this.audioContext) {
                    this.audioContext.close(); // 关闭旧的音频上下文
                }
                if (this.source) {
                    this.source.disconnect();
                    this.source = null;
                }
                this.audioContext = null;
            }
            //更新wavefuer示波
            this.wavesurfer = WaveSurfer.create({
                container: "#wavesurfer",
                waveColor: '#4e4376',
                progressColor: '#2b5876',
                media: this.audioElement,
            });
            // 初始化 绑定web audio api
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.analyser = this.audioContext.createAnalyser();
            this.source = this.audioContext.createMediaElementSource(this.audioElement);
            // 连接音频源到分析器
            this.source.connect(this.analyser);
            this.analyser.connect(this.audioContext.destination);
            this.analyser.fftSize = 256; // FFT大小，可以根据需要调整
            this.drawWaver();
        },
        // 绘制波纹
        drawWaver() {
            const audioElement = this.audioElement;
            const canvas = this.$refs.canvas;
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight * 0.3;
            if (this.analyser === null) return;
            const bufferLength = this.analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);
            const canvasContext = canvas.getContext('2d');
            const lineWidth = canvas.width / bufferLength;
            const gradient1 = canvasContext.createLinearGradient(0, 0, canvas.width, 0);
            gradient1.addColorStop(0, "rgba(150,96,238,1)");
            gradient1.addColorStop(0.2, "rgba(170,79,249,1)");
            gradient1.addColorStop(1, "rgba(53,199,253,1)");
            audioElement.addEventListener('play', () => {
                this.audioContext.resume().then(() => {
                    this.isPlaying = true;
                    renderFrame();
                });
            });
            var that = this;
            function renderFrame() {
                if (!that.analyser) return;
                that.analyser.getByteTimeDomainData(dataArray);
                canvasContext.clearRect(0, 0, canvas.width, canvas.height);
                const centerY = canvas.height / 2;
                canvasContext.beginPath();
                canvasContext.moveTo(0, centerY);
                that.rippleAmplitude = Math.sin(Date.now() * that.rippleSpeed) * 10;
                if (that.audioElement.paused) {
                    // 添加波纹效果
                    for (let x = 0; x < canvas.width; x++) {
                        // 使用正弦函数计算波浪的垂直位置
                        const y = centerY + that.rippleAmplitude * Math.sin(that.rippleFrequency * x + that.rippleSpeed * Date.now()) + 10;
                        // 将点连接起来形成波浪线
                        canvasContext.lineTo(x, y);
                        x += lineWidth;
                    }

                } else {
                    let x = 0;
                    for (let i = 0; i < bufferLength; i++) {
                        const value = (dataArray[i] / 128) * canvas.height - centerY;
                        const y = centerY + value + that.rippleAmplitude - 90;
                        canvasContext.lineTo(x, y);
                        x += lineWidth;
                    }
                }
                canvasContext.lineWidth = lineWidth;
                canvasContext.strokeStyle = gradient1;
                canvasContext.stroke();
                requestAnimationFrame(renderFrame);
            }
        },
        activateCard(card) {
            this.activeCard = card;
        }
    }
};
</script>
  
<style>
.AIMusic-container {
    display: flex;
    justify-content: space-around;
    align-items: center;
    height: calc(100vh - 48px);
    /* background-image: linear-gradient(-20deg, #2b5876 0%, #4e4376 100%); */
    /* transition: background-color 0.5s; */
}

.card {
    width: 30%;
    height: 300px;
    padding: 20px;
    border-radius: 10px;
    background-color: white;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    transition: box-shadow 0.3s, transform 0.3s;
}

.card:hover {
    box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.2);
    transform: translateY(-5px);
}



.active-card {}

.option-box {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.input-text-container {
    width: 100%;
    max-height: 60%;
    margin-bottom: 10px;
    padding: 5px;
    /* 让旗下图标absolute的固定 */
    position: relative; 
}

.user-textarea-prompt{
    resize: none;
}

.random-icon {
  position: absolute;
  right: 0px; /* 调整水平位置 */
  border: 0.5px solid rgb(212, 212, 212);
  border-radius: 50%;
  margin-top: -100px;
}

.random-icon:hover{
    border: 1px solid rgrgb(155, 155, 155);
    box-shadow: 0 0 8px 10px rgba(232,237,250,.6),0 2px 4px 0 rgba(232,237,250,.5);
}


.slider-container {
    width: 80%;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.time-slider {
    width: 100%;
    margin-bottom: 10px;
}

.slider-value {
    font-size: 14px;
    color: #777;
    margin-bottom: 5px;
}

.generate-button {
    background-color: #007bff;
    color: white;
    border: none;
    width: 128px;
    height: 48px;
    border-radius: 5px;
    cursor: pointer;
}


/* 进度条 */

.musicGenerate-progress {
    width: 100%;
    appearance: none;
    border: none;
    height: 10px;
    border-radius: 5px;
    background-color: #333;
    position: relative;
    overflow: hidden;
}

.musicGenerate-progress::-webkit-progress-bar {
    background-color: transparent;
}

.musicGenerate-progress::-webkit-progress-value {
    background: linear-gradient(to right, #00a6ff, #00a6ff, #0053a0);
}

.musicGenerate-progress::-moz-progress-bar {
    background: linear-gradient(to right, #00a6ff, #00a6ff, #0053a0);
}

.progress-container {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.progress-text {
    font-size: 18px;
    margin-top: 10px;
}

.star-container {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 20px;
    width: 100%;
    overflow: hidden;
}

.star {
    position: relative;
    width: 20px;
    height: 20px;
    background-color: transparent;
    animation: twinkle 2s infinite ease-in-out;
}

.star:before {
    content: "";
    position: absolute;
    top: -3px;
    left: -3px;
    width: 100%;
    height: 100%;
    background: radial-gradient(ellipse at center, #ffffff, transparent);
    transform: rotate(45deg);
}

@keyframes twinkle {

    0%,
    100% {
        opacity: 1;
    }

    50% {
        opacity: 0;
    }
}


/* 播放器 */
.audio-player {
    width: 80%;
    margin-top: 20px;
}

.audioContainer {
    width: 100%;
}

#wavesurfer {
    width: 80%;
    margin: 20px;
}

.fm {
    position: fixed;
    bottom: 0px;
    width: 100%;
    z-index: -1;
}
</style>
  