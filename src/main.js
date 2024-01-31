import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 预览组件以及样式
import VMdPreview from '@kangc/v-md-editor/lib/preview';
import '@kangc/v-md-editor/lib/style/preview.css';
import createCopyCodePlugin from '@kangc/v-md-editor/lib/plugins/copy-code/index';
import '@kangc/v-md-editor/lib/plugins/copy-code/copy-code.css';
//样式
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js';
import '@kangc/v-md-editor/lib/theme/style/github.css';

// highlightjs
import hljs from 'highlight.js';

// 选择使用主题
VMdPreview.use(githubTheme, {
    Hljs: hljs,
});
VMdPreview.use(createCopyCodePlugin());

createApp(App)
.use(store)
.use(router)
.use(VMdPreview)
.mount('#app')
