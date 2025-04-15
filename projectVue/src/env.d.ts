/// <reference types="vite/client" />

declare module '*.vue' {
    import type { DefineComponent } from 'vue'
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
    const component: DefineComponent<{}, {}, any>
    export default component
}

declare module 'vue-amazing-ui' {
    import { Select, Input } from 'vue-amazing-ui';
    export { Select, Input };
}

// 解决Volar类型检查的问题
declare global {
    namespace JSX {
        interface IntrinsicElements {
            [elem: string]: any
        }
    }
}

export { };
