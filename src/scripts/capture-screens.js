#!/usr/bin/env node

/**
 * Script para capturar screenshots de todas as páginas do protótipo
 * Execute: node scripts/capture-screens.js
 * Requer: puppeteer
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Configurações
const BASE_URL = 'http://localhost:3000'; // URL do seu app local
const OUTPUT_DIR = './exports/screenshots';
const VIEWPORT = { width: 1440, height: 900 }; // Desktop
const MOBILE_VIEWPORT = { width: 375, height: 812 }; // Mobile

// Páginas para capturar
const PAGES = [
  { name: 'home', path: '/', interactions: [] },
  { name: 'rooms', path: '/?page=rooms', interactions: [] },
  { name: 'room-details', path: '/?page=rooms', interactions: [
    { action: 'click', selector: '[data-testid="room-1"]' }
  ]},
  { name: 'services', path: '/?page=services', interactions: [] },
  { name: 'service-details', path: '/?page=services', interactions: [
    { action: 'click', selector: '[data-testid="service-1"]' }
  ]},
  { name: 'attractions', path: '/?page=attractions', interactions: [] },
  { name: 'login', path: '/?page=login', interactions: [] },
  { name: 'register', path: '/?page=register', interactions: [] },
];

// Estados para capturar
const STATES = [
  { name: 'default', actions: [] },
  { name: 'mobile', actions: [], viewport: MOBILE_VIEWPORT },
  { name: 'dark-mode', actions: [
    { action: 'addClassToHtml', className: 'dark' }
  ]},
];

async function captureScreenshots() {
  // Criar diretório de output
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const browser = await puppeteer.launch({
    headless: false, // Para debug, mude para true em produção
    defaultViewport: null,
  });

  try {
    for (const page of PAGES) {
      console.log(`📸 Capturando página: ${page.name}`);
      
      for (const state of STATES) {
        const browserPage = await browser.newPage();
        
        // Configurar viewport
        const viewport = state.viewport || VIEWPORT;
        await browserPage.setViewport(viewport);
        
        // Navegar para a página
        await browserPage.goto(`${BASE_URL}${page.path}`, {
          waitUntil: 'networkidle0'
        });
        
        // Executar interações da página
        for (const interaction of page.interactions) {
          await executeInteraction(browserPage, interaction);
        }
        
        // Executar ações do estado
        for (const action of state.actions) {
          await executeStateAction(browserPage, action);
        }
        
        // Aguardar renderização
        await browserPage.waitForTimeout(1000);
        
        // Capturar screenshot
        const filename = `${page.name}-${state.name}-${viewport.width}x${viewport.height}.png`;
        const filepath = path.join(OUTPUT_DIR, filename);
        
        await browserPage.screenshot({
          path: filepath,
          fullPage: true,
        });
        
        console.log(`✅ Salvo: ${filename}`);
        await browserPage.close();
      }
    }
    
    // Gerar índice HTML com todas as capturas
    await generateIndex();
    
  } catch (error) {
    console.error('❌ Erro ao capturar screenshots:', error);
  } finally {
    await browser.close();
  }
}

async function executeInteraction(page, interaction) {
  switch (interaction.action) {
    case 'click':
      await page.waitForSelector(interaction.selector);
      await page.click(interaction.selector);
      await page.waitForTimeout(500);
      break;
    case 'hover':
      await page.waitForSelector(interaction.selector);
      await page.hover(interaction.selector);
      await page.waitForTimeout(300);
      break;
    case 'scroll':
      await page.evaluate((y) => window.scrollTo(0, y), interaction.y || 500);
      await page.waitForTimeout(300);
      break;
  }
}

async function executeStateAction(page, action) {
  switch (action.action) {
    case 'addClassToHtml':
      await page.evaluate((className) => {
        document.documentElement.classList.add(className);
      }, action.className);
      break;
    case 'setViewport':
      await page.setViewport(action.viewport);
      break;
  }
}

async function generateIndex() {
  const screenshots = fs.readdirSync(OUTPUT_DIR)
    .filter(file => file.endsWith('.png'))
    .sort();
  
  const html = `
<!DOCTYPE html>
<html>
<head>
  <title>Protótipo - Screenshots</title>
  <style>
    body { font-family: system-ui; padding: 20px; background: #f5f5f5; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
    .card { background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    .card img { width: 100%; height: auto; display: block; }
    .card-title { padding: 12px 16px; font-weight: 600; border-bottom: 1px solid #eee; }
    .card-meta { padding: 8px 16px; font-size: 14px; color: #666; }
  </style>
</head>
<body>
  <h1>📱 Protótipo Hotel - Screenshots</h1>
  <p>Capturas de tela de todas as páginas do protótipo para importação no Figma.</p>
  
  <div class="grid">
    ${screenshots.map(screenshot => {
      const [page, state, viewport] = screenshot.replace('.png', '').split('-');
      return `
        <div class="card">
          <div class="card-title">${page.charAt(0).toUpperCase() + page.slice(1)}</div>
          <div class="card-meta">${state} • ${viewport}</div>
          <img src="${screenshot}" alt="${page} ${state}" />
        </div>
      `;
    }).join('')}
  </div>
  
  <div style="margin-top: 40px; padding: 20px; background: white; border-radius: 8px;">
    <h2>🎨 Como importar no Figma:</h2>
    <ol>
      <li>Drag & drop das imagens para o Figma</li>
      <li>Use como referência para recriar componentes</li>
      <li>Configure protótipo interativo com overlays</li>
      <li>Use Auto Layout para responsividade</li>
    </ol>
  </div>
</body>
</html>`;
  
  fs.writeFileSync(path.join(OUTPUT_DIR, 'index.html'), html);
  console.log('📋 Índice gerado: exports/screenshots/index.html');
}

// Função para capturar componentes individuais
async function captureComponents() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  
  // Componentes para capturar isoladamente
  const components = [
    { name: 'Header', selector: 'header' },
    { name: 'Footer', selector: 'footer' },
    { name: 'PaymentModal', trigger: '[data-testid="open-payment"]', selector: '[data-testid="payment-modal"]' },
    { name: 'RoomCard', selector: '[data-testid^="room-"]' },
    { name: 'ServiceCard', selector: '[data-testid^="service-"]' },
  ];
  
  await page.goto(`${BASE_URL}`, { waitUntil: 'networkidle0' });
  
  for (const component of components) {
    try {
      // Trigger se necessário (para modals)
      if (component.trigger) {
        await page.click(component.trigger);
        await page.waitForTimeout(500);
      }
      
      const element = await page.$(component.selector);
      if (element) {
        await element.screenshot({
          path: path.join(OUTPUT_DIR, `component-${component.name}.png`)
        });
        console.log(`✅ Componente capturado: ${component.name}`);
      }
      
      // Fechar modal se aberto
      if (component.trigger) {
        await page.keyboard.press('Escape');
        await page.waitForTimeout(300);
      }
      
    } catch (error) {
      console.warn(`⚠️  Erro ao capturar ${component.name}:`, error.message);
    }
  }
  
  await browser.close();
}

// Script principal
async function main() {
  console.log('🚀 Iniciando captura de screenshots...');
  console.log(`📍 URL base: ${BASE_URL}`);
  console.log(`💾 Output: ${OUTPUT_DIR}`);
  
  await captureScreenshots();
  await captureComponents();
  
  console.log('✨ Captura concluída!');
  console.log('📋 Abra exports/screenshots/index.html para visualizar');
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { captureScreenshots, captureComponents };