// /**
//  * Configurações centralizadas das variáveis de ambiente
//  * 
//  * No Vite, as variáveis de ambiente devem começar com VITE_ para serem expostas ao cliente.
//  * Elas são substituídas em tempo de build, então import.meta.env é usado ao invés de process.env
//  */

// interface EnvConfig {
//   API_AUTH_URL: string;
//   API_RESERVA_URL: string;
//   API_QUARTO_URL: string;
//   API_SERVICOS_URL: string;
//   API_PAGAMENTO_URL: string;
// }

// const env: EnvConfig = {
//   API_AUTH_URL: import.meta.env.VITE_API_AUTH_URL || 'http://localhost:3001',
//   API_RESERVA_URL: import.meta.env.VITE_API_RESERVA_URL || 'http://localhost:3002',
//   API_QUARTO_URL: import.meta.env.VITE_API_QUARTO_URL || 'http://localhost:3003',
//   API_SERVICOS_URL: import.meta.env.VITE_API_SERVICOS_URL || 'http://localhost:3004',
//   API_PAGAMENTO_URL: import.meta.env.VITE_API_PAGAMENTO_URL || 'http://localhost:3005',
// };

// export default env;

interface EnvConfig {
  API_AUTH_URL: string;
  API_RESERVA_URL: string;
  API_QUARTO_URL: string;
  API_SERVICOS_URL: string;
  API_PAGAMENTO_URL: string;
}

const env: EnvConfig = {
  API_AUTH_URL: import.meta.env.VITE_API_AUTH_URL ?? 'http://localhost:3001',
  API_RESERVA_URL: import.meta.env.VITE_API_RESERVA_URL ?? 'http://localhost:3002',
  API_QUARTO_URL: import.meta.env.VITE_API_QUARTO_URL ?? 'http://localhost:3003',
  API_SERVICOS_URL: import.meta.env.VITE_API_SERVICOS_URL ?? 'http://localhost:3004',
  API_PAGAMENTO_URL: import.meta.env.VITE_API_PAGAMENTO_URL ?? 'http://localhost:3005'
};

export default env;
