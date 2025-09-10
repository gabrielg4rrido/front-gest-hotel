// Code Connect para o componente PaymentModal
import { figma } from '@figma/code-connect';
import { PaymentModal } from './PaymentModal';

figma.connect(PaymentModal, 'https://www.figma.com/design/[SEU_FILE_ID]/[NODE_ID]', {
  props: {
    isOpen: figma.boolean('isOpen'),
    type: figma.enum('type', {
      room: 'room',
      service: 'service',
    }),
    // Mapeamento de dados do modal
    data: figma.children('Content'),
  },
  example: (props) => (
    <PaymentModal
      isOpen={props.isOpen}
      type={props.type}
      data={props.data}
      onClose={() => {}}
    />
  ),
});