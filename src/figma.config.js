// Configuração do Figma Code Connect
module.exports = {
  codeConnect: {
    include: ['./components/**/*.tsx'],
    exclude: ['./components/ui/**/*.tsx'], // Excluir ShadCN components
    parser: 'react',
  },
  
  // Mapeamento de tokens de design
  tokens: {
    colors: './styles/globals.css',
    spacing: './styles/globals.css',
    typography: './styles/globals.css',
  },
  
  // Configuração do plugin
  plugins: [
    {
      name: 'tailwind-figma-sync',
      config: {
        cssFile: './styles/globals.css',
        components: './components',
      }
    }
  ]
};