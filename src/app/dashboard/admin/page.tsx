'use client';

import BasicTabs from '@/app/components/basicTabs/BasicTabs';
import { useMyContext } from '@/app/contexts/MyContext';
import ADMUsuario from '@/app/components/admUsuario/ADMUsuario';
import ADMEntregador from '@/app/components/admEntregador/ADMEntregador';
import AdmInserirUsuario from '@/app/components/admInserirUsuario/AdmInserirUsuario';

export default function Admin() {
  const { setTitulo }: any = useMyContext();

  setTitulo('Pagina administrador');

  return (
    <div className="w-full">
      <BasicTabs
        labelTab={['ADM usuarios', 'ADM entregadores', 'Inserir usuario']}
        componentsTab={[
          <ADMUsuario />,
          <ADMEntregador />,
          <AdmInserirUsuario />,
        ]}
      />
    </div>
  );
}
