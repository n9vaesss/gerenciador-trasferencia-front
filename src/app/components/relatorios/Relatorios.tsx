import React, { useState } from 'react';
import Cookie from 'js-cookie';
import axios from 'axios';
import { Field, Form, Formik } from 'formik';
import FormSelect from '../FormSelect';
import { Button } from '@mui/material';
import BasicSpeedDial from '../basicSpeedDial/BasicSpeedDial';
import Table from '../table/Table';
import { useMyContext } from '@/app/contexts/MyContext';

interface Transferencia {
  id: number;
  numeroNota: string;
  lojaRemetente: string;
  lojaDestinatario: string;
  horaDeRegistro: string;
  usuario: {
    id: number;
    username: string;
    password: string;
    lojaDeRegistro: string;
    roles: { id: number; nome: string }[];
  };
  status: string;
  entregador: {
    id: number;
    nomeCompleto: string;
    cpf: string;
    ativo: boolean;
  };
}

export default function Relatorios() {
  const [transferencias, setTransferencias] = React.useState<Transferencia[]>(
    [],
  );
  const [transferenciasFiltradas, setTransferenciasFiltradas] = React.useState<
    Transferencia[]
  >([]);
  const [entregadoresFromatados, setEntregadoresFromatados] = React.useState(
    [],
  );
  const { setLoad }: any = useMyContext();
  const token = Cookie.get('auth_token');
  const loja = Cookie.get('loja_registro');
  const [tableKey, setTableKey] = useState<string>('');

  React.useEffect(() => {
    const handleBuscarEntregadores = async () => {
      try {
        setLoad(true);
        const response = await axios.get(
          `http://89.116.73.130:8080/entregadores`,
          {
            headers: {
              Authorization: token,
            },
          },
        );
        const responseFormatada = response.data.map((entregador: any) => ({
          label: entregador.nomeCompleto,
          value: entregador.id,
        }));
        setEntregadoresFromatados(responseFormatada);
      } catch (error) {
        console.log(error);
      } finally {
        setLoad(false);
      }
    };

    handleBuscarEntregadores();
  }, []);

  React.useEffect(() => {
    const handleBuscarTransferencias = async () => {
      if (loja === 'TODAS') {
        try {
          setLoad(true);
          const response = await axios.get(
            `http://89.116.73.130:8080/transferencias`,
            {
              headers: {
                Authorization: token,
              },
            },
          );
          setTransferencias(response.data);
          setTransferenciasFiltradas(response.data);
          console.log(response.data);
        } catch (error) {
          console.log(error);
        } finally {
          setLoad(false);
        }
      } else {
        console.log('teste');
      }
    };

    handleBuscarTransferencias();
  }, []);

  const handleSubmit = (values) => {
    const { entregador, dataInicio, dataFim, status } = values;

    if (dataInicio > dataFim) {
      alert('A data de início não pode ser maior que a data de fim.');
      return;
    }

    let filteredTransfers = transferencias;

    if (entregador) {
      filteredTransfers = filteredTransfers.filter(
        (objeto) => objeto.entregador.id === parseInt(entregador),
      );
    }

    if (dataInicio && dataFim) {
      const startDate = new Date(dataInicio + 'T00:00:00Z');
      const endDate = new Date(dataFim + 'T23:59:59Z');

      filteredTransfers = filteredTransfers.filter((objeto) => {
        const transferDate = new Date(objeto.horaDeRegistro);
        return transferDate >= startDate && transferDate <= endDate;
      });
    }

    if (status) {
      filteredTransfers = filteredTransfers.filter(
        (objeto) => objeto.status === status,
      );
    }

    setTransferenciasFiltradas(filteredTransfers);
    setTableKey(Math.random().toString());
  };

  const handleReset = () => {
    setTransferenciasFiltradas(transferencias);
    setTableKey(Math.random().toString());
  };

  const rows = transferenciasFiltradas.map((transferencia: any) => {
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
      <div>
        <Formik
          initialValues={{
            entregador: '',
            dataInicio: '',
            dataFim: '',
            status: '',
          }}
          onSubmit={handleSubmit}
        >
          {({ resetForm }) => (
            <Form className="gap-6 flex mt-8 w-full">
              <FormSelect
                name="entregador"
                options={entregadoresFromatados}
                label="Selecione o entregador"
                tamanho={220}
              />
              <Field type="date" name="dataInicio" className="input" />
              <Field type="date" name="dataFim" className="input" />
              <FormSelect
                name="status"
                options={[
                  { label: 'Pendente', value: 'PENDENTE' },
                  { label: 'Enviada', value: 'ENVIADA' },
                  { label: 'Finalizada', value: 'FINALIZADA' },
                  { label: 'Paga', value: 'PAGA' },
                ]}
                label="Selecione o status"
                tamanho={220}
              />
              <Button type="submit" variant="contained" className="button">
                Filtrar
              </Button>
              <Button
                type="button"
                variant="contained"
                className="button"
                onClick={() => {
                  handleReset();
                  resetForm();
                }}
              >
                Mostrar Todos
              </Button>
            </Form>
          )}
        </Formik>
      </div>
      <div>
        {transferenciasFiltradas.length > 0 ? (
          <Table
            key={tableKey}
            headCells={headCells}
            rows={rows}
            nomeTabela="Transferências recebidas"
            tituloModal="Alterar status de enviada para finalizada"
            status="relatorios"
          />
        ) : (
          <p className="p-4">Não há transferências recebidas.</p>
        )}
      </div>
      <BasicSpeedDial rows={rows} />
    </div>
  );
}
