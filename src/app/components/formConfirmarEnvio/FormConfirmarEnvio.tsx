import { useMyContext } from '@/app/contexts/MyContext';
import { Button } from '@mui/material';
import axios from 'axios';
import Cookie from 'js-cookie';
import React, { useEffect, useState } from 'react';

export default function FormConfirmarEnvio({ id }: any) {
  const { setLoad, fecharModal, setFecharModal, setAttTabela, attTabela }: any =
    useMyContext();
  const token = Cookie.get('auth_token');
  const [dadosTransferencia, setDadosTransferencia] = useState<any>(null);

  useEffect(() => {
    const handleBuscarTransferencia = async () => {
      try {
        setLoad(true);
        const response = await axios.get(
          `http://89.116.74.67:8080/transferencias/${id}`,
          {
            headers: {
              Authorization: token,
            },
          },
        );
        setDadosTransferencia(response.data);
        console.log(response.data);
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

  const handleAlterarStatus = async () => {
    try {
      setLoad(true);
      await axios.put(
        `http://89.116.74.67:8080/transferencias/${id}/status`,
        null,
        {
          params: {
            status: 'ENVIADA',
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
          {dadosTransferencia.status === 'PENDENTE' && (
            <div className="flex flex-col items-center justify-center">
              <p>
                Gostaria de enviar a nota de número:{' '}
                {dadosTransferencia.numeroNota} ?
              </p>
              <div className="mt-4">
                <Button onClick={handleAlterarStatus}>Sim</Button>
                <Button onClick={handleFecharModal}>Não</Button>
              </div>
            </div>
          )}

          {dadosTransferencia.status === 'ENVIADA' && (
            <div className="flex flex-col items-center justify-center">
              <p>
                A nota de número {dadosTransferencia.numeroNota} foi enviada.
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
