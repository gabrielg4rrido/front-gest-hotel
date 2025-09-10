#!/usr/bin/env node

/**
 * Script para preparar exportação completa para Figma
 * Gera estrutura organizada com componentes, páginas e assets
 */

const fs = require('fs');
const path = require('path');

// Configurações
const OUTPUT_DIR = './exports/figma-ready';
const COMPONENTS_DIR = path.join(OUTPUT_DIR, 'components');
const PAGES_DIR = path.join(OUTPUT_DIR, 'pages');
const ASSETS_DIR = path.join(OUTPUT_DIR, 'assets');
const TOKENS_DIR = path.join(OUTPUT_DIR, 'tokens');

async function prepareExport() {
  console.log('🎨 Preparando exportação para Figma...');
  
  // Criar estrutura de diretórios
  [OUTPUT_DIR, COMPONENTS_DIR, PAGES_DIR, ASSETS_DIR, TOKENS_DIR].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
  
  // 1. Exportar design tokens
  await exportDesignTokens();
  
  // 2. Gerar especificações de componentes
  await generateComponentSpecs();
  
  // 3. Criar guia de páginas
  await generatePagesGuide();
  
  // 4. Gerar arquivo de navegação/fluxo
  await generateNavigationFlow();
  
  // 5. Criar README para importação
  await generateImportGuide();
  
  console.log('✅ Exportação preparada em:', OUTPUT_DIR);
}

async function exportDesignTokens() {
  console.log('📋 Exportando design tokens...');
  
  // Ler tokens existentes
  const tokensPath = './tokens/design-tokens.json';
  const tokens = JSON.parse(fs.readFileSync(tokensPath, 'utf8'));
  
  // Converter para formato Figma Variables
  const figmaTokens = {
    "version": "1.0.0",
    "collections": {
      "core": {
        "name": "Core Tokens",
        "modes": ["light", "dark"],
        "variables": {}
      }
    },
    "tokens": {}
  };
  
  // Converter cores
  Object.entries(tokens.colors).forEach(([name, token]) => {
    figmaTokens.tokens[`color/${name}`] = {
      "type": "color",
      "value": token.value,
      "description": token.description || "",
      "extensions": {
        "figma": {
          "collection": "core",
          "scopes": ["ALL_SCOPES"]
        }
      }
    };
  });
  
  // Converter espaçamentos
  Object.entries(tokens.spacing).forEach(([name, token]) => {
    figmaTokens.tokens[`spacing/${name}`] = {
      "type": "dimension",
      "value": token.value,
      "extensions": {
        "figma": {
          "collection": "core",
          "scopes": ["GAP", "SPACING", "WIDTH_HEIGHT"]
        }
      }
    };
  });
  
  // Converter tipografia
  if (tokens.typography) {
    Object.entries(tokens.typography["font-size"] || {}).forEach(([name, token]) => {
      figmaTokens.tokens[`typography/size/${name}`] = {
        "type": "dimension",
        "value": token.value,
        "extensions": {
          "figma": {
            "collection": "core",
            "scopes": ["FONT_SIZE"]
          }
        }
      };
    });
  }
  
  fs.writeFileSync(
    path.join(TOKENS_DIR, 'figma-variables.json'),
    JSON.stringify(figmaTokens, null, 2)
  );
  
  // Gerar CSS para importação
  const cssTokens = `
/* Design Tokens para importação no Figma */
:root {
${Object.entries(tokens.colors).map(([name, token]) => 
  `  --color-${name}: ${token.value};`
).join('\n')}

${Object.entries(tokens.spacing).map(([name, token]) => 
  `  --spacing-${name}: ${token.value};`
).join('\n')}
}
`;
  
  fs.writeFileSync(path.join(TOKENS_DIR, 'tokens.css'), cssTokens);
  
  console.log('✅ Design tokens exportados');
}

async function generateComponentSpecs() {
  console.log('🧩 Gerando especificações de componentes...');
  
  const components = [
    {
      name: 'Header',
      description: 'Cabeçalho principal com navegação',
      props: ['currentPage', 'onNavigate'],
      states: ['default', 'mobile-menu-open'],
      variants: ['desktop', 'mobile']
    },
    {
      name: 'PaymentModal',
      description: 'Modal de pagamento reutilizável',
      props: ['isOpen', 'type', 'data', 'onClose'],
      states: ['closed', 'room-booking', 'service-booking'],
      variants: ['default']
    },
    {
      name: 'RoomCard',
      description: 'Card de quarto com informações',
      props: ['room', 'onViewDetails'],
      states: ['default', 'hover'],
      variants: ['grid', 'list']
    },
    {
      name: 'ServiceCard',
      description: 'Card de serviço',
      props: ['service', 'onViewDetails'],
      states: ['default', 'hover'],
      variants: ['default']
    },
    {
      name: 'Footer',
      description: 'Rodapé com links e informações',
      props: [],
      states: ['default'],
      variants: ['desktop', 'mobile']
    }
  ];
  
  components.forEach(component => {
    const spec = `# ${component.name}

## Descrição
${component.description}

## Props
${component.props.map(prop => `- \`${prop}\``).join('\n')}

## Estados
${component.states.map(state => `- ${state}`).join('\n')}

## Variantes
${component.variants.map(variant => `- ${variant}`).join('\n')}

## Implementação
\`\`\`tsx
// Ver: /components/${component.name}.tsx
\`\`\`

## Design Guidelines
- Usar Auto Layout para responsividade
- Aplicar design tokens consistentes
- Manter hierarquia visual clara
- Estados de interação (hover, active, disabled)

## Figma Components
1. Criar Component Set com variantes
2. Configurar propriedades booleanas para estados
3. Usar Instance Swap para conteúdo dinâmico
4. Aplicar constraints para responsividade
`;
    
    fs.writeFileSync(
      path.join(COMPONENTS_DIR, `${component.name}.md`),
      spec
    );
  });
  
  console.log('✅ Especificações de componentes geradas');
}

async function generatePagesGuide() {
  console.log('📄 Gerando guia de páginas...');
  
  const pages = [
    {
      name: 'Home',
      path: '/',
      description: 'Página inicial com hero, quartos em destaque, serviços e atrações',
      components: ['Header', 'Hero', 'FeaturedRooms', 'ServicesPreview', 'AttractionsPreview', 'Footer'],
      breakpoints: ['desktop: 1440px', 'tablet: 768px', 'mobile: 375px']
    },
    {
      name: 'Rooms',
      path: '/rooms',
      description: 'Lista de quartos com filtros',
      components: ['Header', 'RoomCard', 'Filters', 'Pagination', 'Footer'],
      breakpoints: ['desktop: 1440px', 'tablet: 768px', 'mobile: 375px']
    },
    {
      name: 'Room Details',
      path: '/rooms/:id',
      description: 'Detalhes do quarto com galeria e formulário de reserva',
      components: ['Header', 'Breadcrumb', 'ImageGallery', 'RoomInfo', 'BookingForm', 'Footer'],
      breakpoints: ['desktop: 1440px', 'tablet: 768px', 'mobile: 375px']
    },
    {
      name: 'Services',
      path: '/services',
      description: 'Lista de serviços do hotel',
      components: ['Header', 'ServiceCard', 'Categories', 'Footer'],
      breakpoints: ['desktop: 1440px', 'tablet: 768px', 'mobile: 375px']
    },
    {
      name: 'Service Details',
      path: '/services/:id',
      description: 'Detalhes do serviço com agendamento',
      components: ['Header', 'Breadcrumb', 'ServiceInfo', 'ScheduleForm', 'Footer'],
      breakpoints: ['desktop: 1440px', 'tablet: 768px', 'mobile: 375px']
    },
    {
      name: 'Attractions',
      path: '/attractions',
      description: 'Atrações locais e pontos turísticos',
      components: ['Header', 'AttractionCard', 'Map', 'Filters', 'Footer'],
      breakpoints: ['desktop: 1440px', 'tablet: 768px', 'mobile: 375px']
    },
    {
      name: 'Login',
      path: '/login',
      description: 'Página de login',
      components: ['Header', 'LoginForm', 'Footer'],
      breakpoints: ['desktop: 1440px', 'tablet: 768px', 'mobile: 375px']
    },
    {
      name: 'Register',
      path: '/register',
      description: 'Página de cadastro',
      components: ['Header', 'RegisterForm', 'Footer'],
      breakpoints: ['desktop: 1440px', 'tablet: 768px', 'mobile: 375px']
    }
  ];
  
  const guide = `# Guia de Páginas - Hotel Booking System

## Overview
Sistema de reservas de hotel com 8 páginas principais, todas responsivas e com navegação integrada.

## Páginas

${pages.map(page => `
### ${page.name}
- **Path:** \`${page.path}\`
- **Descrição:** ${page.description}
- **Componentes:** ${page.components.join(', ')}
- **Breakpoints:** ${page.breakpoints.join(', ')}

`).join('')}

## Navegação
- Header com menu principal
- Breadcrumb em páginas de detalhes
- Footer com links secundários
- Modal de pagamento sobreposto

## Estados Globais
- Light/Dark mode
- Mobile menu aberto/fechado
- Modal de pagamento aberto/fechado
- Páginas com loading states

## Responsividade
- Desktop-first approach
- Breakpoints: 1440px, 768px, 375px
- Grid system responsivo
- Imagens otimizadas por dispositivo

## Figma Structure
\`\`\`
📁 Hotel Booking System
├── 🎨 Design System
│   ├── Colors
│   ├── Typography  
│   ├── Spacing
│   └── Components
├── 📱 Pages
│   ├── Home (Desktop/Tablet/Mobile)
│   ├── Rooms (Desktop/Tablet/Mobile)
│   ├─��� Room Details (Desktop/Tablet/Mobile)
│   ├── Services (Desktop/Tablet/Mobile)
│   ├── Service Details (Desktop/Tablet/Mobile)
│   ├── Attractions (Desktop/Tablet/Mobile)
│   ├── Login (Desktop/Tablet/Mobile)
│   └── Register (Desktop/Tablet/Mobile)
└── 🔄 Prototype
    └── Navigation Flow
\`\`\`
`;
  
  fs.writeFileSync(path.join(PAGES_DIR, 'README.md'), guide);
  console.log('✅ Guia de páginas gerado');
}

async function generateNavigationFlow() {
  console.log('🔄 Gerando fluxo de navegação...');
  
  const navigationFlow = {
    "title": "Hotel Booking - Navigation Flow",
    "startNode": "home",
    "nodes": {
      "home": {
        "title": "Home",
        "type": "page",
        "connections": ["rooms", "services", "attractions", "login"]
      },
      "rooms": {
        "title": "Rooms List",
        "type": "page", 
        "connections": ["home", "room-details", "login"]
      },
      "room-details": {
        "title": "Room Details",
        "type": "page",
        "connections": ["rooms", "payment-modal"]
      },
      "services": {
        "title": "Services List", 
        "type": "page",
        "connections": ["home", "service-details", "login"]
      },
      "service-details": {
        "title": "Service Details",
        "type": "page", 
        "connections": ["services", "payment-modal"]
      },
      "attractions": {
        "title": "Attractions",
        "type": "page",
        "connections": ["home"]
      },
      "login": {
        "title": "Login",
        "type": "page",
        "connections": ["register", "home"]
      },
      "register": {
        "title": "Register", 
        "type": "page",
        "connections": ["login", "home"]
      },
      "payment-modal": {
        "title": "Payment Modal",
        "type": "overlay",
        "connections": ["room-details", "service-details"]
      }
    },
    "interactions": [
      {
        "from": "home",
        "to": "rooms", 
        "trigger": "header-nav",
        "animation": "navigate"
      },
      {
        "from": "room-details",
        "to": "payment-modal",
        "trigger": "book-now-button",
        "animation": "modal-overlay"
      }
    ]
  };
  
  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'navigation-flow.json'),
    JSON.stringify(navigationFlow, null, 2)
  );
  
  console.log('✅ Fluxo de navegação gerado');
}

async function generateImportGuide() {
  console.log('📖 Gerando guia de importação...');
  
  const guide = `# 🎨 Guia de Importação para Figma

## 📋 Checklist de Preparação

### 1. Capturar Screenshots
\`\`\`bash
# Instalar dependências
npm install puppeteer

# Executar captura
node scripts/capture-screens.js

# Verificar exports/screenshots/
\`\`\`

### 2. Preparar Assets
- ✅ Screenshots de todas as páginas
- ✅ Design tokens exportados
- ✅ Especificações de componentes
- ✅ Fluxo de navegação

## 🚀 Importação no Figma

### Opção 1: Plugin "HTML/CSS to Figma"
1. **Instalar plugin** no Figma
2. **Abrir novo arquivo** Figma
3. **Executar plugin** e colar HTML/CSS de cada página
4. **Organizar frames** por breakpoint

### Opção 2: Manual com Screenshots
1. **Criar novo arquivo** Figma
2. **Importar screenshots** por drag & drop
3. **Organizar em frames** (1440x900, 768x1024, 375x812)
4. **Recriar componentes** usando screenshots como referência

### Opção 3: Plugin "Figma from Code"
1. **Conectar repositório** GitHub ao plugin
2. **Mapear componentes** React para Figma
3. **Importar estrutura** automaticamente
4. **Ajustar styling** conforme necessário

## 🎨 Configuração do Design System

### 1. Importar Variables
\`\`\`
Figma → Libraries → Variables → Import
Arquivo: exports/figma-ready/tokens/figma-variables.json
\`\`\`

### 2. Criar Components
- Use **Component Sets** para variantes
- Configure **Properties** para estados
- Aplique **Auto Layout** para responsividade
- Use **Constraints** para diferentes tamanhos

### 3. Organizar Biblioteca
\`\`\`
📁 Hotel Booking System
├── 🎨 Foundations
│   ├── Colors
│   ├── Typography
│   ├── Spacing
│   └── Effects
├── 🧩 Components
│   ├── Header
│   ├── Footer
│   ├── Cards
│   ├── Forms
│   └── Modals
└── 📱 Templates
    ├── Home
    ├── Rooms
    ├── Services
    └── Auth
\`\`\`

## 🔄 Configurar Protótipo

### 1. Connections
- **Smart Animate** entre páginas
- **Overlay** para modals
- **Scroll** para páginas longas

### 2. Interactions
\`\`\`
Header Navigation:
Home → On Click → Navigate to → Rooms

Book Now Button:
Room Details → On Click → Open Overlay → Payment Modal

Mobile Menu:
Header → On Click → Smart Animate → Mobile Menu Open
\`\`\`

### 3. Device Frames
- **Desktop**: 1440x900
- **Tablet**: 768x1024  
- **Mobile**: 375x812

## 📱 Responsividade

### Auto Layout Settings
- **Direction**: Vertical para páginas
- **Spacing**: Entre elementos (8px, 16px, 24px)
- **Padding**: Interno dos containers (16px, 24px, 32px)
- **Resizing**: Fill container para largura

### Constraints
- **Header**: Fixed top
- **Footer**: Fixed bottom
- **Content**: Scale para altura
- **Sidebar**: Fixed left (se aplicável)

## 🎯 Finalização

### 1. Testar Protótipo
- [ ] Navegação entre páginas funciona
- [ ] Responsividade em diferentes tamanhos
- [ ] Modals abrem/fecham corretamente
- [ ] Estados hover/active aplicados

### 2. Documentar
- [ ] Adicionar descriptions aos components
- [ ] Documentar interactions complexas
- [ ] Criar style guide page
- [ ] Configurar sharing settings

### 3. Compartilhar
- [ ] Publicar biblioteca se necessário
- [ ] Configurar permissions
- [ ] Gerar link de protótipo
- [ ] Testar em diferentes dispositivos

## 🔗 Links Úteis

- [Figma Dev Mode](https://help.figma.com/hc/en-us/articles/15023124644247)
- [Auto Layout Guide](https://help.figma.com/hc/en-us/articles/5731482952599)
- [Prototyping in Figma](https://help.figma.com/hc/en-us/articles/360040314193)
- [Component Properties](https://help.figma.com/hc/en-us/articles/5579474826519)

## ✨ Tips & Tricks

### Performance
- Use **Instance Swap** para conteúdo dinâmico
- Otimize **imagens** antes de importar
- Minimize **sobreposições** desnecessárias

### Manutenção
- Mantenha **naming consistency** 
- Use **description fields** para documentação
- Configure **version control** para mudanças grandes

### Colaboração
- Use **comments** para feedback
- Configure **branch review** se necessário  
- Documente **handoff specs** para desenvolvimento
`;
  
  fs.writeFileSync(path.join(OUTPUT_DIR, 'IMPORT-GUIDE.md'), guide);
  console.log('✅ Guia de importação gerado');
}

// Script principal
async function main() {
  await prepareExport();
  
  console.log('\n🎉 Exportação completa!');
  console.log('\n📋 Próximos passos:');
  console.log('1. Execute: node scripts/capture-screens.js');
  console.log('2. Abra o Figma e siga o guia: exports/figma-ready/IMPORT-GUIDE.md');
  console.log('3. Use screenshots como referência para recriar componentes');
  console.log('4. Configure protótipo interativo com navegação');
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { prepareExport };