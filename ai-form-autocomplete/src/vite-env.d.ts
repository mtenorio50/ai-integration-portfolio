/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_AI_PROVIDER?: string
    readonly VITE_OPENAI_API_KEY?: string
    readonly VITE_HF_TOKEN?: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
