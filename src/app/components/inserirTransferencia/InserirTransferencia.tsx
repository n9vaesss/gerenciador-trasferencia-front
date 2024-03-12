import { Form, Formik } from 'formik';
import FormInput from '../FormInput';
import { useMyContext } from '@/app/contexts/MyContext';
import * as yup from 'yup';
import FormSelect from '../FormSelect';
import axios from 'axios';
import Cookie from 'js-cookie';
import React from 'react';
import { Button } from '@mui/material';
import useUsuario from '@/app/hooks/useGetUsuario';
import { toast } from 'react-toastify';

export default function InserirTransferencia() {
  const { setLoad }: any = useMyContext();
  const lojaRegistro = Cookie.get('loja_registro');

  const options = [
    {
      label: 'LOJA 1',
      value: 'LOJA_1',
    },
    {
      label: 'LOJA 2',
      value: 'LOJA_2',
    },
    {
      label: 'LOJA 3',
      value: 'LOJA_3',
    },
    {
      label: 'LOJA 4',
      value: 'LOJA_4',
    },
    {
      label: 'LOJA 5',
      value: 'LOJA_5',
    },
    {
      label: 'LOJA 6',
      value: 'LOJA_6',
    },
  ];

  const [entregadores, setEntregadores] = React.useState([]);
  const [entregadoresFromatados, setEntregadoresFromatados] = React.useState(
    [],
  );
  const token = Cookie.get('auth_token');
  const usuarioLogado = Cookie.get('username');

  const { getUsuario }: any = useUsuario(usuarioLogado);

  const usuario = getUsuario();

  React.useEffect(() => {
    const handleBuscarInfo = async () => {
      const handleRequestRoles = async () => {
        const token = Cookie.get('auth_token');
        try {
          setLoad(true);
          const response = await axios.get(
            `http://89.116.74.67:8080/entregadores`,
            {
              headers: {
                Authorization: token,
              },
            },
          );
          setEntregadores(response.data);
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
      await handleRequestRoles();
    };

    handleBuscarInfo();
  }, []);

  const addressSchema = yup.object().shape({
    numeroDaNota: yup
      .string()
      .required('Preencha todos os campos!')
      .max(70, 'Máximo de caracteres excedido (70)'),
    lojaDestinatario: yup.string().required('Preencha todos os campos!'),
    entregador: yup.string().required('Preencha todos os campos!'),
  });

  const handleSubmit = async (values: any) => {
    const encontrarItemPorId = (array: any, id: any) => {
      return array.find((item: any) => item.id === id);
    };

    const dataTrandferencia = {
      numeroNota: values.numeroDaNota,
      lojaRemetente: lojaRegistro,
      lojaDestinatario: values.lojaDestinatario,
      status: 'PENDENTE',
      entregador: encontrarItemPorId(entregadores, values.entregador),
      usuario: usuario,
    };

    try {
      setLoad(true);
      await axios.post(
        'http://89.116.74.67:8080/transferencias',
        dataTrandferencia,
        {
          headers: {
            Authorization: token,
          },
        },
      );
      toast.success('Tansferencia inserida com sucesso!');
    } catch (erro) {
      console.log(erro);
      toast.error('Algo deu errado!');
    } finally {
      setLoad(false);
      values.numeroDaNota = '';
      values.lojaDestinatario = '';
      values.entregador = '';
    }
  };

  return (
    <div className="my-5 flex flex-col gap-3">
      <h1 className="font-bold">INSERIR NOVA TRANSFERENCIA</h1>
      <Formik
        initialValues={{
          numeroDaNota: '',
          lojaDestinatario: '',
          entregador: '',
        }}
        onSubmit={handleSubmit}
        validationSchema={addressSchema}
      >
        <Form className="gap-6 flex flex-col">
          <FormInput name="numeroDaNota" label="Numero da nota" />
          <FormSelect
            name="lojaDestinatario"
            options={options}
            label="Loja destinatario"
          />
          <FormSelect
            name="entregador"
            options={entregadoresFromatados}
            label="Selecione um entregador"
          />

          <Button type="submit" variant="contained" className="button">
            enviar
          </Button>
        </Form>
      </Formik>
    </div>
  );
}
