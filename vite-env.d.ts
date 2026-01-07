/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_SLACK_WEBHOOK_URL: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
    readonly glob: (pattern: string, options?: { as?: string; eager?: boolean }) => Record<string, any>
}
