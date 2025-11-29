interface ImportMetaEnv {
  readonly VITE_API_AUTH_URL: string;
  readonly VITE_API_RESERVA_URL: string;
  readonly VITE_API_QUARTO_URL: string;
  readonly VITE_API_SERVICOS_URL: string;
  readonly VITE_API_PAGAMENTO_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}