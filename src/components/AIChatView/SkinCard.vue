<template>
    <div v-if="isOpen" class="floating-card">
        
      <div @click="closeCard">关闭</div>
    </div>
  </template>
  
  <script>
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
  .floating-card {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    padding: 20px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    /* Add more styles as needed */
  }
  </style>  