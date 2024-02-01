<template>
    <div v-if="isOpen" class="floating-card" :class="{ 'card-open': isOpen }">
        <div class="card-header">
            <div v-if="isDetails" class="header-title">
                <img src="../../assets/icon/back.svg" class="header-icon" @click="cancelBack" />
                <span>角色详情</span>
                <img src="../../assets/icon/delete.svg" class="header-icon" @click="deleteRole" />
            </div>
            <div v-else-if="isShowMarket" class="header-title">
                <img src="../../assets/icon/back.svg" class="header-icon" @click="cancelBack" />
                <span>角色市场</span>
            </div>
            <div v-else-if="isShowAdd" class="header-title">
                <img src="../../assets/icon/back.svg" class="header-icon" @click="cancelBack" />
                <span>自定义</span>
            </div>
            <div v-else class="header-title">
                <img src="../../assets/icon/storage.svg" title="角色市场" class="header-icon" @click="showMarket" />
                <span>角色仓库</span>
            </div>
        </div>
        <!-- 详情页 -->
        <div v-if="isDetails" class="card-container-details" :class="{ 'details': isDetails }">
            <img :src="currentLive2dData.avatar || defaultAvatar" @error="setDefaultAvatar" class="details-avatar">
            <h3 class="details-name" v-if="currentLive2dData.role_name">{{ currentLive2dData.role_name }}</h3>
            <p class="details-info" v-if="currentLive2dData.role_info">{{ currentLive2dData.role_info }}</p>
            <ul class="details-list">
                <li v-if="currentLive2dData.id"><strong>ID:</strong>{{ currentLive2dData.id }}</li>
                <li v-if="currentLive2dData.role_id"><strong>Role ID:</strong>{{ currentLive2dData.role_id }}</li>
                <li v-if="currentLive2dData.width && currentLive2dData.height"><strong>尺寸:</strong>{{
                    currentLive2dData.width }} x {{ currentLive2dData.height }}</li>
                <li v-if="currentLive2dData.scale"><strong>比例尺:</strong>{{ currentLive2dData.scale }}</li>
                <li v-if="currentLive2dData.x"><strong>位置:</strong>{{ currentLive2dData.x }}</li>
                <li v-if="currentLive2dData.idle"><strong>空闲动画:</strong>{{ currentLive2dData.idle }}</li>
                <li v-if="currentLive2dData.talk && currentLive2dData.talk.length">
                    <strong>说话动画:</strong>
                    <ul>
                        <li v-for="(talkItem, index) in currentLive2dData.talk" :key="index">{{ talkItem }}</li>
                    </ul>
                </li>
                <li v-if="currentLive2dData.role_url">
                    <strong>模型地址:</strong>
                    <a :href="currentLive2dData.role_url" target="_blank">{{ currentLive2dData.role_url }}</a>
                </li>
            </ul>
        </div>
        <!-- TODO:市场页面 -->
        <div v-else-if="isShowMarket">
            <h1>此页面还在施工中。。。</h1>
            <img src="../../assets//icon/warning.svg" class="details-avatar" />
        </div>
        <!-- 添加/编辑 -->
        <div v-else-if="isShowAdd" class="card-container-add">
            <form>
                <div class="add-input-group">
                    <label for="id">ID:</label>
                    <input class="add-input" type="text" name="id" v-model="currentLive2dData.id" disabled>
                </div>
                <div class="add-input-group">
                    <label for="role_name">角色名称:</label>
                    <input type="text" class="add-input" name="role_name" v-model="currentLive2dData.role_name"
                        required="true">
                </div>
                <div class="add-input-group">
                    <label for="role_info">角色预设:</label>
                    <textarea class="add-input add-textarea" ref="add-textarea" name="role_info"
                        :style="{ 'height': textareaHeight }"
                        placeholder="下面我让你来充当翻译家，你的目标是把任何语言翻译成中文，请翻译时不要带翻译腔，而是要翻译得自然、流畅和地道，使用优美和高雅的表达方式。请翻译下面这句话：“how are you ?”"
                        v-model="currentLive2dData.role_info"></textarea>
                </div>
                <div class="add-input-group">
                    <label for="role_avatar">角色头像地址:</label>
                    <input type="text" class="add-input" name="role_avatar" v-model="currentLive2dData.avatar">
                </div>
                <div class="add-input-group">
                    <label for="role_url">角色模型地址:</label>
                    <input type="text" class="add-input" name="role_url" v-model="currentLive2dData.role_url">
                </div>
                <div class="add-input-group-single-line">
                    <label>role_id:</label>
                    <input type="text" class="add-input" name="role_id" v-model="currentLive2dData.role_id">
                </div>
                <div class="add-input-group-box" id="model_position">
                    <label>模型位置:</label>
                    <input type="text" class="add-input" placeholder="height" value="395"
                        v-model="currentLive2dData.height">
                    <input type="text" class="add-input" placeholder="width" value="320" v-model="currentLive2dData.width">
                    <input type="text" class="add-input" placeholder="scale" value="0.12" v-model="currentLive2dData.scale">
                    <input type="text" class="add-input" placeholder="x" value="-100" v-model="currentLive2dData.x">
                </div>
                <div class="add-input-group-box" id="model_animation">
                    <label>模型预设动画关键词:</label>
                    <input type="text" class="add-input" placeholder="idle" value="activity"
                        v-model="currentLive2dData.activity">
                    <input type="text" class="add-input" placeholder="talk Array" value="">
                </div>
                <button type="button" class="add-submit-btn" @click="saveAdd">保存</button>
            </form>
        </div>
        <!-- 默认页面 -->
        <div v-else class="card-container">
            <div v-for="item in localLive2dList" :key="item.id" class="character-card" @click="showDetails(item)">
                <img :src="item.avatar || defaultAvatar" @error="setDefaultAvatar" :alt="item.role_name"
                    class="character-avatar">
                <h3 class="character-name">{{ item.role_name }}</h3>
                <p class="character-info">{{ item.role_info }}</p>
            </div>
            <!-- 自定义添加卡片 -->
            <div class="character-card" @click="addRole">
                <img src="../../assets/icon/add.svg" class="character-avatar">
                <h3 class="character-name">自定义</h3>
                <p class="character-info">这里实现您的专属助手</p>
            </div>
        </div>
        <div class="card-footer">
            <button class="card-button" @click="reloadData">重置</button>
            <button class="card-button" @click="closeCard">关闭</button>
        </div>
    </div>
</template>
  
<script>
import "@/assets/css/floating-card.css";
// import calcTextareaHeight from '@/utils/calcTextareaHeight';
import defaultAvatar from "@/assets/AIAvatar.jpg"
import { live2dList } from "@/api/live2DData";


export default {
    props: {
        isOpen: Boolean,
        live2dList: Array,
    },
    data() {
        return {
            defaultAvatar: defaultAvatar,
            isDetails: false,
            isShowMarket: false,
            isShowAdd: false,
            currentLive2dData: {},
            textareaHeight: "48px",
            localLive2dList: this.live2dList
        }
    },
    watch: {
        'currentLive2dData.role_info'() {
            this.autoExpandTextarea();
        },

    },
    mounted() {
        //读取localstorage加载localLive2dList
        // 检查项目是否存在于 localStorage
        if (localStorage.getItem('localLive2dList')) {
            // 解析字符串为 JSON
            try {
                const parsed = JSON.parse(localStorage.getItem('localLive2dList'));
                this.localLive2dList = parsed;
            } catch (e) {
                console.error('Could not parse localLive2dList from localStorage', e);
            }
        }
    },
    methods: {
        autoExpandTextarea() {
            //   this.textareaHeight = calcTextareaHeight(this.$refs.textarea, 1, 7).height;
        },
        closeCard() {
            this.$emit('close');
        },
        reloadData(){
            this.localLive2dList = live2dList;
            this.saveLocalStorage();
        },
        setDefaultAvatar(event) {
            event.target.src = this.defaultAvatar;
        },
        //进入详情页
        showDetails(item) {
            this.isDetails = true;
            this.currentLive2dData = item;
        },
        cancelBack() {
            this.isDetails = false;
            this.isShowMarket = false;
            this.isShowAdd = false;
        },
        //添加自定义角色
        addRole() {
            this.isShowAdd = true;
            this.currentLive2dData = {};
            this.currentLive2dData.id = this.live2dList.length + 1;
        },
        saveAdd() {
            if (this.currentLive2dData.role_name === "") return;
            if (this.currentLive2dData.role_info === ""){
                this.currentLive2dData.role_info = "";
            }
            this.localLive2dList.push(this.currentLive2dData);
            this.isShowAdd = false;
            this.saveLocalStorage();
            this.$emit('update:live2dList', this.localLive2dList);
        },
        deleteRole(){
            const index = this.localLive2dList.findIndex(item => item.id === this.currentLive2dData.id);
            if (index !== -1) {
                this.localLive2dList.splice(index, 1);
            }
            this.saveLocalStorage();
            this.isDetails = false;
        },
        //保存到本地
        saveLocalStorage(){
            const parsed = JSON.stringify(this.localLive2dList);
            localStorage.setItem('localLive2dList', parsed);
        },
        //TODO:市场
        showMarket() {
            this.isShowMarket = true;
        },
    }
};
</script>
  
<style scoped>
.floating-card {
    width: 40%;
    height: 60%;
}

.card-container {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    /*间隙*/
    overflow: hidden;
    overflow-y: auto;
    /* 如果您想在垂直方向上滚动 */
    overflow-x: hidden;
    /* 如果不需要水平滚动，隐藏它 */
}

.character-card {
    width: 20%;
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    padding: 10px;
    text-align: center;
}

.character-card:hover {
    box-shadow: 0 0 2px 2px rgba(71, 167, 235, .86);
}

.character-avatar {
    max-width: 100%;
    border-radius: 50%;
}

.character-name {
    font-size: 18px;
    font-weight: bold;
    margin: 10px 0 5px;
}

.character-info {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 4;
    overflow: hidden;
    font-size: 14px;
    min-height: 64px;
    text-overflow: ellipsis;
}

/* 定义滚动条的大小和滑块(scroll-thumb)等元素的样式 */
.card-container::-webkit-scrollbar {
    width: 10px;
    /* 滚动条的宽度 */
}

/* 滚动条滑道(scroll-track)的样式 */
.card-container::-webkit-scrollbar-track {
    background: #f1f1f1;
    /* 滚动条滑道的背景色 */
    border-radius: 10px;
    /* 滚动条滑道的圆角 */
}

/* 滚动条滑块(scroll-thumb)的样式 */
.card-container::-webkit-scrollbar-thumb {
    background: #888;
    /* 滚动条滑块的背景色 */
    border-radius: 10px;
    /* 滚动条滑块的圆角 */
}

/* 滚动条滑块在hover时的样式 */
.card-container::-webkit-scrollbar-thumb:hover {
    background: #555;
    /* 滚动条滑块在hover时的背景色 */
}

/* 详情页面 */
.card-container-details {
    background: #ffffff;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    margin: 1rem;
    padding: 1rem;
    position: relative;
    transition: all 0.3s ease-in-out;
    overflow-y: auto;
}

.details-card {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.details-avatar {
    width: 150px;
    height: 150px;
    border-radius: 75px;
    object-fit: cover;
    margin-bottom: 1rem;
    border: 3px solid #eee;
}

.details-name {
    font-size: 1.5rem;
    color: #444;
    margin-bottom: 0.5rem;
}

.details-info {
    font-size: 1rem;
    color: #666;
    margin-bottom: 1rem;
    text-align: center;
}

.details-list {
    list-style: none;
    padding: 0;
    width: 100%;
}

.details-list li {
    font-size: 0.95rem;
    padding: 0.5rem 1rem;
    border-bottom: 1px solid #eee;
}

.details-list li:last-child {
    border-bottom: none;
}

.details-list strong {
    font-weight: bold;
}

.details-list a {
    color: #007bff;
    text-decoration: none;
    transition: color 0.3s ease-in-out;
}

.details-list a:hover {
    color: #0056b3;
}

/* 自定义添加页面 */
.card-container-add {
    max-width: 600px;
    margin: 20px auto;
    background-color: #fff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    overflow-y: auto;
}

.add-input-group,
.add-input-group-single-line,
.add-input-group-box {
    margin-bottom: 15px;
}

.add-input-group label {
    display: block;
    font-weight: bold;
    margin-bottom: 5px;
    color: #333;
}

.add-input {
    width: 100%;
    padding: 8px;
    font-size: 14px;
    border: 1px solid #ccc;
    border-radius: 4px;
    margin-top: 5px;
}

.add-input:focus {
    box-shadow: 0 0 2px 2px rgba(71, 167, 235, .86);
}

.add-input-group-box {
    display: flex;
    justify-content: space-between;
    border: 1px solid #ddd;
    padding: 10px;
    border-radius: 4px;
    margin-bottom: 1rem;
}

.add-input-group-box label {
    flex-basis: 100%;
    margin-bottom: 0.5rem;
}

.add-input-group-box input[type="text"] {
    display: inline-block;
    margin-right: 10px;
    width: calc(25% - 10px);
}


.add-submit-btn {
    position: relative;
    left: 50%;
    width: 50%;
    background-color: #4CAF50;
    color: #fff;
    font-size: 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.add-submit-btn:hover {
    background-color: #45a049;
}
</style>  