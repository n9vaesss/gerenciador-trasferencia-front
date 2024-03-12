import { useMyContext } from '@/app/contexts/MyContext';
import { Button } from '@mui/material';
import axios from 'axios';
import { Form, Formik } from 'formik';
import Cookie from 'js-cookie';
import React from 'react';
import * as yup from 'yup';
import FormSelect from '../FormSelect';

export default function FormConfirmarRecebimento({ id }: any) {
  const { setLoad, fecharModal, setFecharModal, setAttTabela, attTabela }: any =
    useMyContext();
  const [dadosTransferencia, setDadosTransferencia] = React.useState<any>(null);
  const [entregadoresFromatados, setEntregadoresFromatados] =
    React.useState(null);
  const token = Cookie.get('auth_token');

  const addressSchema = yup.object().shape({
    entregador: yup.string().required('Preencha todos os campos!'),
  });

  React.useEffect(() => {
    const handleBuscarTransferencia = async () => {
      try {
        setLoad(true);
        const response = await axios.get(
          `http://89.116.73.130:8080/transferencias/${id}`,
          {
            headers: {
              Authorization: token,
            },
          },
        );
        setDadosTransferencia(response.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoad(false);
      }
    };

    handleBuscarTransferencia();
  }, []);

  React.useEffect(() => {
    const handleBuscarTransferencia = async () => {
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

    handleBuscarTransferencia();
  }, []);

  const handleFecharModal = () => {
    setFecharModal(!fecharModal);
  };

  const handleSubmit = async (values: any) => {
    const novoStatus = 'FINALIZADA';
    const idEntregador = values.entregador;
    try {
      setLoad(true);
      await axios.put(
        `http://89.116.73.130:8080/transferencias/${id}/status-entregador`,
        null,
        {
          params: {
            status: novoStatus,
            entregador: idEntregador,
          },
          headers: {
            Authorization: token,
          },
        },
      );
      setAttTabela(!attTabela);
      window.location.reload();
    } catch (error) {
      console.error(error);
    } finally {
      setLoad(false);
      setFecharModal(!fecharModal);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      {dadosTransferencia && (
        <>
          {dadosTransferencia.status === 'ENVIADA' && (
            <div className="flex flex-col items-center justify-center">
              <p>
                Gostaria de finalizar a nota de número:{' '}
                {dadosTransferencia.numeroNota} ?
              </p>

              <Formik
                initialValues={{
                  entregador: dadosTransferencia.entregador.id,
                }}
                onSubmit={handleSubmit}
                validationSchema={addressSchema}
              >
                <Form className="gap-6 flex flex-col mt-8 w-full">
                  <FormSelect
                    name="entregador"
                    options={entregadoresFromatados}
                    label="Selecione o entregador responsável"
                  />

                  <Button type="submit" variant="contained" className="button">
                    Sim
                  </Button>
                </Form>
              </Formik>

              <div className="mt-4">
                <Button onClick={handleFecharModal}>Não</Button>
              </div>
            </div>
          )}

          {dadosTransferencia.status === 'PENDENTE' && (
            <div className="flex flex-col items-center justify-center">
              <p>
                A nota de número {dadosTransferencia.numeroNota} ainda não foi
                enviada.
              </p>
              <Button className="mt-4" onClick={handleFecharModal}>
                Fechar
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
