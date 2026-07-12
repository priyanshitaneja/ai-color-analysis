/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BUILD_TARGET?: 'extension';
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
