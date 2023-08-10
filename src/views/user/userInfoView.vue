<template>
    <div class="content">
        用户中心
    </div>
</template>

<script>
import { getUserInfoApi } from "@/api/getUser";
export default {
    data() {

    },
    computed: {
        getToken() {
            return this.$store.state.token;
        },
        getUserData() {
            return this.$store.getters.getUserInfo;
        }
    },
    methods:{
        async getUserInfo() {
            if(!this.getToken) return;
            try {
                const result = await getUserInfoApi(this.getToken)
                if (result.data.code === 0) {
                    localStorage.setItem('userInfo', result.data.data)
                    this.$store.dispatch("setUserInfo",result.data.data)
                    //刷新页面
                    location.reload();
                }
            } catch (error) {
                console.log(error)
            }
        },
    },
    mounted() {
        if (this.getToken) {
            if (this.getUserData.userName === '游客') {
                console.log("no cache")
               this.getUserInfo();
            }
        }
    }
}
</script>

<style></style>