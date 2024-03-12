'use client';

import BasicTabs from '@/app/components/basicTabs/BasicTabs';
import { useMyContext } from '@/app/contexts/MyContext';
import RecebimentoTransferencia from '@/app/components/recebimentoTransferencia/RecebimentoTransferencia';
import InserirTransferencia from '@/app/components/inserirTransferencia/InserirTransferencia';
import EnviadaTransferencia from '@/app/components/enviadaTransferencia/EnviadaTransferencia';
import Relatorios from '@/app/components/relatorios/Relatorios';

export default function Transferencia() {
  const { setTitulo }: any = useMyContext();

  setTitulo('Pagina transferencia');

  return (
    <div className="w-full">
      <BasicTabs
        labelTab={['Inserção', 'Enviada', 'Recebimento', 'Relatorios']}
        componentsTab={[
          <InserirTransferencia />,
          <EnviadaTransferencia />,
          <RecebimentoTransferencia />,
          <Relatorios />,
        ]}
      />
    </div>
  );
}
