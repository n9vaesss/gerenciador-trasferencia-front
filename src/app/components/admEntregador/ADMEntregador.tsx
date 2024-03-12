import { useMyContext } from '@/app/contexts/MyContext';
import { Autocomplete, Button, TextField } from '@mui/material';
import React from 'react';
import Cookie from 'js-cookie';
import axios from 'axios';
import BasicModal from '../basicModal/BasicModal';
import FormInserEntregador from '../formInserirEntregador/FormInserirEntregador';
import { toast } from 'react-toastify';

interface Entregadores {
  label: string;
  year: number;
}

interface Entregador {
  id: string;
  nomeCompleto: string;
  cpf: string;
  ativo: boolean;
}

export default function ADMEntregador() {
  const { setLoad, fecharModal }: any = useMyContext();
  const token = Cookie.get('auth_token');

  const [entregadores, setEntregadores] = React.useState<Entregadores[]>([]);
  const [entregadorSelecionado, setEntregadorSelecionado] =
    React.useState<Entregadores | null>(null);
  const [infoEntregador, setInfoEntregador] = React.useState<
    Entregador | undefined
  >(undefined);

  React.useEffect(() => {
    const buscarTodosEntregadores = async () => {
      try {
        setLoad(true);
        const response = await axios.get(
          `http://89.116.74.67:8080/entregadores/all`,
          {
            headers: {
              Authorization: token,
            },
          },
        );

        const entregadoresFormatados: Entregadores[] = response.data.map(
          (usuario: any) => ({
            label: usuario.nomeCompleto,
            year: usuario.id,
          }),
        );
        setEntregadores(entregadoresFormatados);
      } catch (error) {
        console.log(error);
      } finally {
        setLoad(false);
      }
    };

    buscarTodosEntregadores();
  }, [fecharModal]);

  const handleBuscarInfo = async () => {
    if (entregadorSelecionado && entregadorSelecionado.year) {
      const handleRequestRoles = async () => {
        const token = Cookie.get('auth_token');
        try {
          setLoad(true);
          const response = await axios.get(
            `http://89.116.74.67:8080/entregadores/${entregadorSelecionado.year}`,
            {
              headers: {
                Authorization: token,
              },
            },
          );
          setInfoEntregador(response.data);
        } catch (error) {
          console.log(error);
        } finally {
          setLoad(false);
        }
      };
      await handleRequestRoles();
    } else {
      setInfoEntregador(undefined);
    }
  };

  const handleAtivarOuDesativar = async (values: any) => {
    try {
      setLoad(true);
      const entregadorData = {
        id: values.id,
        nomeCompleto: values.nomeCompleto,
        cpf: values.cpf,
        ativo: !values.ativo,
      };
      await axios.put(
        'http://89.116.74.67:8080/entregadores',
        entregadorData,
        {
          headers: {
            Authorization: token,
          },
        },
      );
      toast.success('Entregador atualizado!');
    } catch (erro) {
      toast.error('Algo deu errado!');
      console.log(erro);
    } finally {
      setLoad(false);
    }
    handleBuscarInfo();
  };

  return (
    <div className="my-5 flex flex-col gap-3">
      <div className="flex gap-6 min-w-96">
        <Autocomplete
          disablePortal
          id="combo-box-demo"
          options={entregadores}
          sx={{ width: 300 }}
          getOptionLabel={(option) => option.label}
          renderInput={(params) => (
            <TextField {...params} label="Entregadores" />
          )}
          onChange={(event, newValue: Entregadores | null) => {
            setEntregadorSelecionado(newValue);
          }}
        />
        <Button
          variant="contained"
          className="button"
          onClick={handleBuscarInfo}
        >
          Buscar informações
        </Button>

        <BasicModal
          compoentModal={<FormInserEntregador />}
          tituloComponente={'Insira um novo entregador!'}
          textoBotao={'Inserir Entregador'}
        />
      </div>
      <div>
        {infoEntregador && infoEntregador.id !== undefined ? (
          <div className="flex flex-col gap-3">
            <span>
              NOME DO ENTREGADOR:
              <span className="font-bold"> {infoEntregador.nomeCompleto}</span>
            </span>
            <span>
              CPF:
              <span className="font-bold"> {infoEntregador.cpf}</span>
            </span>
            <span>
              STATUS DO ENTREGADOR:
              <span className="font-bold">
                {infoEntregador.ativo == true
                  ? ' ENTREGADOR ATIVO'
                  : ' ENTREGADOR INATIVO'}
              </span>
            </span>
            <Button
              variant="contained"
              className="max-w-72 button"
              onClick={() => handleAtivarOuDesativar(infoEntregador)}
            >
              {infoEntregador.ativo == true
                ? 'Desativar entregador'
                : 'Ativar entregador'}
            </Button>
          </div>
        ) : (
          <span></span>
        )}
      </div>
    </div>
  );
}
