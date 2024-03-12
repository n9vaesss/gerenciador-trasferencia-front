import { useMyContext } from '@/app/contexts/MyContext';
import Table from '../table/Table';
import Cookie from 'js-cookie';
import React from 'react';
import axios from 'axios';

export default function EnviadaTransferencia() {
  const [transferenciasEnviadas, setTransferenciasEnviadas] = React.useState(
    [],
  );
  const { setLoad, attTabela }: any = useMyContext();
  const token = Cookie.get('auth_token');
  const loja = Cookie.get('loja_registro');
  const lojaRegistro = Cookie.get('loja_registro');

  React.useEffect(() => {
    console.log('entrou');
    const handleBuscarTransferenciasEnviadas = async () => {
      if (loja == 'TODAS') {
        try {
          setLoad(true);
          const response = await axios.get(
            `http://89.116.73.130:8080/transferencias/pendentes`,
            {
              headers: {
                Authorization: token,
              },
            },
          );
          setTransferenciasEnviadas(response.data);
        } catch (error) {
          console.log(error);
        } finally {
          setLoad(false);
        }
      } else {
        try {
          setLoad(true);
          const response = await axios.get(
            `http://89.116.73.130:8080/transferencias/${lojaRegistro}/pendentes`,
            {
              headers: {
                Authorization: token,
              },
            },
          );
          setTransferenciasEnviadas(response.data);
        } catch (error) {
          console.log(error);
        } finally {
          setLoad(false);
        }
      }
    };

    handleBuscarTransferenciasEnviadas();
  }, [attTabela]);

  const rows = transferenciasEnviadas.map((transferencia: any) => {
    return createData(
      transferencia.id,
      transferencia.numeroNota,
      transferencia.lojaRemetente,
      transferencia.lojaDestinatario,
      transferencia.horaDeRegistro,
      transferencia.usuario.username,
      transferencia.status,
      transferencia.entregador.id,
      transferencia.entregador.nomeCompleto,
    );
  });

  function createData(
    id: any,
    numeroNota: any,
    lojaRemetente: any,
    lojaDestinatario: any,
    horaDeRegistro: any,
    usuario_username: any,
    status: any,
    entregador_id: any,
    entregador_nomeCompleto: any,
  ) {
    return {
      id,
      numeroNota,
      lojaRemetente,
      lojaDestinatario,
      horaDeRegistro,
      usuario_username,
      status,
      entregador_id,
      entregador_nomeCompleto,
    };
  }

  const headCells = [
    {
      id: 'numeroNota',
      numeric: false,
      disablePadding: true,
      label: 'Numero da nota',
    },
    {
      id: 'lojaRemetente',
      numeric: true,
      disablePadding: false,
      label: 'Loja remetente',
    },
    {
      id: 'lojaDestinatario',
      numeric: true,
      disablePadding: false,
      label: 'Loja destinatario',
    },
    {
      id: 'usuario_username',
      numeric: true,
      disablePadding: false,
      label: 'Usuario de registro',
    },
    {
      id: 'entregador_nomeCompleto',
      numeric: true,
      disablePadding: false,
      label: 'Entregador de registro',
    },
    {
      id: 'status',
      numeric: true,
      disablePadding: false,
      label: 'Status da entrega',
    },
  ];
  return (
    <div>
      {transferenciasEnviadas.length > 0 ? (
        <Table
          headCells={headCells}
          rows={rows}
          nomeTabela="Transferências enviadas"
          tituloModal="Alterar status de pendente para enviada"
          status="enviada"
        />
      ) : (
        <p className="p-4">Não há transferências enviadas.</p>
      )}
    </div>
  );
}
