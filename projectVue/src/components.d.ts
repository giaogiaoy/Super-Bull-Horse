// 为vue-amazing-ui组件添加全局声明
declare module 'vue' {
    export interface GlobalComponents {
        Select: typeof import('vue-amazing-ui')['Select']
        Input: typeof import('vue-amazing-ui')['Input']
        // 添加其他vue-amazing-ui组件
    }
}

export { }
