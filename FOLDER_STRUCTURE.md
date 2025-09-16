# Estrutura de Pastas - Hotel Carioca Palace

## Organização Reorganizada (React Best Practices)

A estrutura do projeto foi reorganizada seguindo as melhores práticas do React para melhor manutenibilidade e escalabilidade.

### Estrutura de Pastas

```
src/
├── components/           # Componentes reutilizáveis
│   ├── ui/              # Componentes da biblioteca UI (shadcn/ui)
│   ├── figma/           # Componentes relacionados ao Figma
│   ├── Header.tsx       # Cabeçalho do site
│   ├── Footer.tsx       # Rodapé do site
│   ├── SearchForm.tsx   # Formulário de busca
│   ├── Breadcrumb.tsx   # Navegação breadcrumb
│   ├── ImageGallery.tsx # Galeria de imagens
│   ├── PaymentModal.tsx # Modal de pagamento
│   └── index.ts         # Exports dos componentes
├── pages/               # Componentes de página
│   ├── HomePage.tsx     # Página inicial
│   ├── RoomsPage.tsx    # Lista de quartos
│   ├── RoomDetailsPage.tsx # Detalhes do quarto
│   ├── ServicesPage.tsx # Lista de serviços
│   ├── ServiceDetailsPage.tsx # Detalhes do serviço
│   ├── AuthPages.tsx    # Páginas de autenticação
│   ├── PaymentPage.tsx  # Página de pagamento
│   ├── UserProfilePage.tsx # Perfil do usuário
│   ├── MyReservationsPage.tsx # Minhas reservas
│   ├── MyTravelsPage.tsx # Minhas viagens
│   ├── PersonalInfoPage.tsx # Informações pessoais
│   ├── AttractionsPage.tsx # Página de atrações
│   ├── AttractionDetailsPage.tsx # Detalhes da atração
│   └── index.ts         # Exports das páginas
├── hooks/               # Custom hooks (para uso futuro)
├── utils/               # Funções utilitárias (para uso futuro)
├── types/               # Definições de tipos TypeScript (para uso futuro)
├── constants/           # Constantes da aplicação (para uso futuro)
├── App.tsx             # Componente principal da aplicação
└── main.tsx            # Ponto de entrada da aplicação
```

### Benefícios da Nova Organização

1. **Separação Clara de Responsabilidades**
   - `pages/` contém componentes que representam páginas completas
   - `components/` contém componentes reutilizáveis
   - `components/ui/` mantém a biblioteca de componentes UI

2. **Melhor Manutenibilidade**
   - Fácil localização de componentes
   - Imports organizados com index files
   - Estrutura escalável para crescimento futuro

3. **Padrões React Modernos**
   - Estrutura de pastas baseada em funcionalidade
   - Separação entre páginas e componentes
   - Preparado para hooks customizados e utilitários

4. **Imports Limpos**
   ```tsx
   // Antes
   import { HomePage } from './components/HomePage';
   import { Header } from './components/Header';
   
   // Depois
   import { HomePage } from './pages';
   import { Header } from './components';
   ```

### Migrações Realizadas

- ✅ Movidos componentes de página para `src/pages/`
- ✅ Mantidos componentes reutilizáveis em `src/components/`
- ✅ Atualizados todos os imports relativos
- ✅ Criados index files para exports limpos
- ✅ Testado build e funcionamento da aplicação

### Próximos Passos Sugeridos

1. **Hooks Customizados**: Mover lógica de estado complexa para hooks em `src/hooks/`
2. **Utilitários**: Criar funções helper em `src/utils/`
3. **Tipos**: Centralizar definições TypeScript em `src/types/`
4. **Constantes**: Mover dados estáticos para `src/constants/`