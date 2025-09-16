# Guia de Integração Figma Dev Mode + Code Connect

## 🎯 Objetivo
Este guia explica como conectar seu projeto React/Tailwind ao Figma usando Dev Mode e Code Connect para sincronização bidirecional.

## 📋 Pré-requisitos

1. **Figma Professional/Organization Plan** (necessário para Dev Mode)
2. **Node.js 16+** instalado
3. **Acesso ao arquivo Figma** como editor
4. **Token de acesso Figma** (Personal Access Token)

## 🚀 Configuração Inicial

### 1. Instalar dependências
```bash
npm install @figma/code-connect
npm install -g @figma/code-connect
```

### 2. Inicializar Code Connect
```bash
npx figma connect init
```

### 3. Configurar token de acesso
```bash
npx figma connect auth
```

## 🔧 Configuração do Projeto

### 1. Editar figma.config.js
Substitua `SEU_FILE_ID_AQUI` pelo ID do seu arquivo Figma:
```javascript
// O ID está na URL: figma.com/design/[FILE_ID]/...
const FIGMA_FILE_ID = 'abcd1234567890';
```

### 2. Configurar tokens de design
Execute o script de sincronização:
```bash
node scripts/sync-figma.js
```

### 3. Publicar conexões
```bash
npx figma connect publish
```

## 📦 Usando Plugins de Importação

### Plugin "HTML/CSS to Figma"
1. Instale no Figma: Plugins → Browse → "HTML/CSS to Figma"
2. Execute seu app React localmente
3. Copie o HTML renderizado do DevTools
4. Cole no plugin para criar frames Figma

### Plugin "Figma to Code"
1. Instale: "Figma to Code" ou "Locofy"
2. Selecione frames no Figma
3. Exporte como React + Tailwind
4. Compare com código existente

## 🔄 Workflow de Sincronização

### Design → Código
1. **Crie/edite componentes no Figma**
2. **Use Dev Mode** para ver especificações
3. **Exporte código** usando plugins
4. **Integre ao projeto** React

### Código → Design
1. **Edite componentes React**
2. **Execute sync script**: `node scripts/sync-figma.js`
3. **Publique mudanças**: `npx figma connect publish`
4. **Visualize no Figma** Dev Mode

## 🎨 Sincronização de Design Tokens

### Figma Variables → CSS Custom Properties
1. **Crie variáveis no Figma** (Colors, Spacing, Typography)
2. **Exporte usando API** ou plugins
3. **Atualize globals.css** com novos tokens
4. **Execute script de sincronização**

### CSS → Figma Variables
1. **Edite globals.css**
2. **Execute**: `node scripts/sync-figma.js`
3. **Importe no Figma** usando plugins de tokens

## 🔍 Dev Mode - Recursos

### Inspeção de Componentes
- **Properties**: Props mapeadas do React
- **Code snippets**: Código React gerado
- **Design specs**: Medidas, cores, tipografia
- **Asset export**: Ícones, imagens

### Code Connect Features
- **Prop mapping**: Props React ↔ Figma variants
- **Live preview**: Componentes reais no Figma
- **Documentation**: Storybook integration
- **Version control**: Git integration

## 📱 Plugins Recomendados

### Para Design → Code
- **Figma to Code** (React + Tailwind)
- **Locofy** (Completo, inclui lógica)
- **Quest** (React + responsive)

### Para Code → Design
- **HTML/CSS to Figma** (Import direto)
- **Design Tokens** (Sincronização de tokens)
- **Component Inspector** (Análise de componentes)

### Para Assets
- **Figma to React** (SVGs e ícones)
- **SVGR** (SVG para componentes React)
- **Unsplash** (Imagens placeholder)

## 🎯 Melhores Práticas

### Estrutura de Componentes
```
components/
├── ComponentName.tsx          # Componente principal
├── ComponentName.figma.tsx    # Code Connect mapping
├── ComponentName.stories.tsx  # Storybook (opcional)
└── ComponentName.test.tsx     # Testes (opcional)
```

### Naming Convention
- **Figma**: PascalCase para componentes
- **React**: PascalCase para componentes
- **Props**: camelCase consistente
- **Variants**: Estados claros (Default, Active, Disabled)

### Token Management
- **Use CSS Custom Properties** para temas
- **Mantenha hierarquia** (primitive → semantic → component)
- **Documente tokens** com descrições claras
- **Versione mudanças** em tokens críticos

## 🚨 Troubleshooting

### Erro: "Component not found"
- Verifique se o NODE_ID está correto
- Confirme que o componente existe no Figma
- Execute `npx figma connect status`

### Erro: "Authentication failed"
- Gere novo Personal Access Token
- Execute `npx figma connect auth` novamente
- Verifique permissões do arquivo

### Erro: "Props not mapping"
- Confirme interface TypeScript
- Verifique mapeamento em .figma.tsx
- Teste com props simples primeiro

## 📚 Recursos Adicionais

- [Figma Dev Mode Documentation](https://help.figma.com/hc/en-us/articles/15023124644247)
- [Code Connect Guide](https://github.com/figma/code-connect)
- [Design Tokens Specification](https://design-tokens.github.io/community-group/)
- [Tailwind CSS Figma Kit](https://www.figma.com/community/file/768809027799962739)

## 🎉 Próximos Passos

1. ✅ Configure tokens de design
2. ✅ Mapeie componentes principais
3. ✅ Estabeleça workflow de sincronização
4. 🔄 Integre com CI/CD
5. 📖 Documente para equipe
6. 🧪 Configure testes de regressão visual