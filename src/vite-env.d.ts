/// <reference types="vite/client" />

interface ImportMetaEnv {
  /**
   * Optional PUBLIC endpoint that receives enquiry submissions (JSON POST).
   * This is a URL, not a secret. Credentials must live on the server only.
   */
  readonly VITE_FORM_ENDPOINT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
