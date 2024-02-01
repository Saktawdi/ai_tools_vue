<template>
  <div v-if="isOpen" class="floating-card" :class="{ 'card-open': isOpen }">
      <div class="card-header">

      </div>
      <div class="card-container">

      </div>
      <div class="card-footer">
          <button class="card-button" @click="closeCard">关闭</button>
      </div>
  </div>
</template>
  
  <script>
  import "@/assets/css/floating-card.css";
  export default {
    props: {
      isOpen: Boolean
    },
    methods: {
      closeCard() {
        this.$emit('close');
      }
    }
  };
  </script>
  
<style scoped>

</style>