<template>
    <div class="custom-select-wrapper" @click="toggleDropdown">
      <div class="custom-select">
        <div class="custom-select__trigger">
          <span>{{ selectedOptionName }}</span>
          <div class="arrow"></div>
        </div>
        <div class="custom-options" v-show="isOpen">
          <div 
            class="custom-option" 
            v-for="option in options"
            :key="option.value"
            :class="{ 'selected': option.value === modelSelected, 'disabled': option.disabled }"
            @click="selectOption(option)"
            v-text="option.name"
          ></div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        isOpen: false,
        modelSelected: "gpt-3.5-turbo-16k-0613",
        selectedOptionName: "gpt-3.5-turbo-16k-0613",
        options: [
  { name: "选择聊天模型", value: null, disabled: true },
  { name: "gpt-3.5-turbo-16k-0613", value: "gpt-3.5-turbo-16k-0613", disabled: false },
  { name: "gpt-3.5-turbo-16k", value: "gpt-3.5-turbo-16k", disabled: false },
  { name: "gpt-3.5-turbo-1106", value: "gpt-3.5-turbo-1106", disabled: false },
  { name: "gpt-3.5-turbo-0613", value: "gpt-3.5-turbo-0613", disabled: false },
  { name: "gpt-3.5-turbo-0301", value: "gpt-3.5-turbo-0301", disabled: false },
  { name: "gpt-3.5-turbo", value: "gpt-3.5-turbo", disabled: false },
  { name: "GPT-4.0(暂时关闭)", value: "Gemini Pro", disabled: true },
  { name: "Gemini Pro(内测)", value: "Gemini Pro", disabled: true }
],
      };
    },
    methods: {
      toggleDropdown() {
        this.isOpen = !this.isOpen;
      },
      selectOption(option) {
        if (option.disabled) {
          return;
        }
        this.modelSelected = option.value;
        this.selectedOptionName = option.name;
        this.isOpen = false;
        // 触发input事件，以便v-model可以更新
        this.$emit('input', this.modelSelected);
        this.isOpen = !this.isOpen;
      }
    }
  };
  </script>
  
  <style scoped>
.custom-select-wrapper {
  position: relative;
  font-family: Arial, sans-serif;
  width: 256px;
  z-index: 1000;
}

.custom-select {
  border: 1px solid #ccc;
  border-radius: 4px;
  overflow: hidden;
}

.custom-select__trigger {
  background-color: #f8f8f8;
  padding: 10px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.arrow {
  width: 0;
  height: 0;
  border: 5px solid transparent;
  border-top-color: #333;
  margin-left: 5px;
}

.custom-options {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  border: 1px solid #ccc;
  border-top: none;
  border-radius: 0 0 4px 4px;
  background-color: #fff;
  z-index: 1000;
}

.custom-option {
  padding: 10px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.custom-option:hover {
  background-color:  #f0f0f0;
}

.custom-option.selected {
  color: #5c9cd8;
}

.custom-option.disabled {
  color: #ccc;
  cursor: not-allowed;
}
  </style>
  