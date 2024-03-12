import { useMyContext } from '@/app/contexts/MyContext';
import { Button } from '@mui/material';
import axios from 'axios';
import Cookie from 'js-cookie';
import React from 'react';

export default function FormConfirmarPagamento({
  id,
}: {
  id: string | string[];
}) {
  const { setLoad, fecharModal, setFecharModal, setAttTabela, attTabela }: any =
    useMyContext();
  const token = Cookie.get('auth_token');

  const handleAlterarStatus = async () => {
    try {
      setLoad(true);
      const ids = Array.isArray(id) ? id : [id];
      await Promise.all(
        ids.map(async (singleId: string) => {
          const response = await axios.get(
            `http://89.116.74.67:8080/transferencias/${singleId}`,
            {
              headers: {
                Authorization: token,
              },
            },
          );
          if (response.data.status === 'FINALIZADA') {
            await axios.put(
              `http://89.116.74.67:8080/transferencias/${singleId}/status`,
              null,
              {
                params: {
                  status: 'PAGA',
                },
                headers: {
                  Authorization: token,
                },
              },
            );
          }
        }),
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
    <div>
      <h1 className="text-center">
        confirmar pagamento de todas notas selecionadas?
      </h1>
      <div className="flex justify-center mt-3">
        <Button onClick={handleAlterarStatus}>sim</Button>
        <Button onClick={() => setFecharModal(!fecharModal)}>não</Button>
      </div>
    </div>
  );
}
