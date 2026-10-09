/** Public build-time environment variables exposed to browser code by Vite. */
interface ImportMetaEnv {
  /** API root; the HTTP client uses `/api` when absent or blank after trimming. */
  readonly VITE_BE_API_URL?: string;
}
