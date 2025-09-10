// Code Connect para o componente Header
import { figma } from '@figma/code-connect';
import { Header } from './Header';

figma.connect(Header, 'https://www.figma.com/design/[SEU_FILE_ID]/[NODE_ID]', {
  props: {
    currentPage: figma.enum('currentPage', {
      home: 'home',
      rooms: 'rooms',
      services: 'services',
      attractions: 'attractions',
      login: 'login',
    }),
    // Mapeamento de propriedades para variantes do Figma
    variant: figma.variant('State', {
      default: 'Default',
      active: 'Active',
    }),
  },
  example: (props) => (
    <Header 
      currentPage={props.currentPage}
      onNavigate={() => {}}
    />
  ),
});