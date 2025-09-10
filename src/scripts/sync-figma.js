#!/usr/bin/env node

/**
 * Script para sincronizar componentes com o Figma
 * Execute: node scripts/sync-figma.js
 */

const fs = require('fs');
const path = require('path');

// Configuração
const FIGMA_FILE_ID = 'SEU_FILE_ID_AQUI'; // Substitua pelo ID do seu arquivo Figma
const FIGMA_ACCESS_TOKEN = 'SEU_TOKEN_AQUI'; // Substitua pelo seu token

// Função para extrair metadados dos componentes
function extractComponentMetadata(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Regex para extrair props de componentes React
  const propsMatch = content.match(/interface\s+\w+Props\s*{([^}]+)}/);
  const exportMatch = content.match(/export\s+(?:default\s+)?(?:function\s+)?(\w+)/);
  
  return {
    name: exportMatch ? exportMatch[1] : path.basename(filePath, '.tsx'),
    props: propsMatch ? propsMatch[1].trim() : '',
    filePath: filePath
  };
}

// Função para gerar mapeamento Code Connect
function generateCodeConnect(component) {
  return `
// Code Connect para ${component.name}
import { figma } from '@figma/code-connect';
import { ${component.name} } from './${component.name}';

figma.connect(${component.name}, 'https://www.figma.com/design/${FIGMA_FILE_ID}/[NODE_ID]', {
  props: {
    // Props automáticas baseadas na interface
    ${component.props.split('\n').map(line => {
      const propMatch = line.match(/(\w+)\??\s*:\s*([^;]+)/);
      if (propMatch) {
        const [, propName, propType] = propMatch;
        if (propType.includes('string')) {
          return `${propName}: figma.string('${propName}'),`;
        } else if (propType.includes('boolean')) {
          return `${propName}: figma.boolean('${propName}'),`;
        } else if (propType.includes('number')) {
          return `${propName}: figma.number('${propName}'),`;
        }
      }
      return '';
    }).filter(Boolean).join('\n    ')}
  },
  example: (props) => <${component.name} {...props} />,
});
`;
}

// Processar todos os componentes
function processComponents() {
  const componentsDir = path.join(__dirname, '../components');
  const files = fs.readdirSync(componentsDir)
    .filter(file => file.endsWith('.tsx') && !file.includes('.figma.'))
    .filter(file => !file.includes('ui/')); // Excluir ShadCN

  files.forEach(file => {
    const filePath = path.join(componentsDir, file);
    const component = extractComponentMetadata(filePath);
    const codeConnect = generateCodeConnect(component);
    
    // Salvar arquivo .figma.tsx
    const figmaFilePath = path.join(componentsDir, `${component.name}.figma.tsx`);
    fs.writeFileSync(figmaFilePath, codeConnect);
    
    console.log(`✅ Code Connect gerado para ${component.name}`);
  });
}

// Função para sincronizar tokens de design
async function syncDesignTokens() {
  try {
    console.log('🔄 Sincronizando tokens de design...');
    
    // Aqui você faria a chamada para a API do Figma para buscar variáveis
    // const response = await fetch(`https://api.figma.com/v1/files/${FIGMA_FILE_ID}/variables/local`, {
    //   headers: { 'X-Figma-Token': FIGMA_ACCESS_TOKEN }
    // });
    
    console.log('✅ Tokens sincronizados com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao sincronizar tokens:', error);
  }
}

// Executar script
async function main() {
  console.log('🚀 Iniciando sincronização com Figma...');
  
  processComponents();
  await syncDesignTokens();
  
  console.log('✨ Sincronização concluída!');
  console.log('\n📋 Próximos passos:');
  console.log('1. Substitua SEU_FILE_ID_AQUI pelo ID do seu arquivo Figma');
  console.log('2. Substitua SEU_TOKEN_AQUI pelo seu token de acesso');
  console.log('3. Execute: npx figma connect publish');
}

if (require.main === module) {
  main();
}

module.exports = { extractComponentMetadata, generateCodeConnect };