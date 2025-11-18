
# Sistema de Reservas de Hotel

This is a code bundle for Sistema de Reservas de Hotel. The original project is available at https://www.figma.com/design/VPwV03AywLD3DiXoGgb7qC/Sistema-de-Reservas-de-Hotel.

## Configuração

### Variáveis de Ambiente

O projeto utiliza variáveis de ambiente para centralizar as configurações das URLs das APIs. Antes de rodar o projeto, você precisa configurar o arquivo `.env`.

1. Copie o arquivo `.env.example` para `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edite o arquivo `.env` e configure as URLs das suas APIs:
   ```env
   VITE_API_AUTH_URL=http://localhost:3000
   VITE_API_RESERVA_URL=http://localhost:3002
   VITE_API_QUARTO_URL=http://localhost:3003
   VITE_API_SERVICOS_URL=http://localhost:3004
   VITE_API_PAGAMENTO_URL=http://localhost:3005
   ```

**Importante:** O arquivo `.env` não deve ser commitado no Git, pois contém configurações sensíveis. Use `.env.example` como template.

## Running the code

Run `npm i` to install the dependencies.

Run `npm run dev` to start the development server.

## Estrutura das APIs

O projeto se conecta a 5 microsserviços diferentes:

- **API de Autenticação** (`VITE_API_AUTH_URL`): Gerencia login, registro e perfil de usuários
- **API de Reservas** (`VITE_API_RESERVA_URL`): Gerencia criação e cancelamento de reservas
- **API de Quartos** (`VITE_API_QUARTO_URL`): Gerencia listagem e detalhes dos quartos
- **API de Serviços** (`VITE_API_SERVICOS_URL`): Gerencia serviços adicionais e listagem de reservas
- **API de Pagamento** (`VITE_API_PAGAMENTO_URL`): Gerencia métodos de pagamento  