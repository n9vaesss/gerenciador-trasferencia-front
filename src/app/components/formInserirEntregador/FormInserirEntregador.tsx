import { Form, Formik } from 'formik';
import FormInput from '../FormInput';
import { Button } from '@mui/material';
import * as yup from 'yup';
import { useMyContext } from '@/app/contexts/MyContext';
import axios from 'axios';
import Cookie from 'js-cookie';
import { toast } from 'react-toastify';

export default function FormInserEntregador() {
  const { setLoad, setFecharModal, fecharModal }: any = useMyContext();
  const token = Cookie.get('auth_token');

  const addressSchema = yup.object().shape({
    nomeCompleto: yup
      .string()
      .required('Preencha todos os campos!')
      .max(70, 'Máximo de caracteres excedido (70)'),
    cpf: yup
      .string()
      .required('Preencha todos os campos!')
      .max(70, 'Máximo de caracteres excedido (70)'),
  });

  const handleSubmit = async (values: any) => {
    const dadosEntregadores = {
      nomeCompleto: values.nomeCompleto,
      cpf: values.cpf,
      ativo: true,
    };

    try {
      setLoad(true);
      await axios.post(
        'http://89.116.74.67:8080/entregadores',
        dadosEntregadores,
        {
          headers: {
            Authorization: token,
          },
        },
      );
      toast.success('Novo entregador inserido!');
    } catch (erro) {
      toast.error('Algo deu errado!');
      console.log(erro);
    } finally {
      setLoad(false);
      setFecharModal(!fecharModal);
    }
  };

  return (
    <Formik
      initialValues={{
        nomeCompleto: '',
        cpf: '',
      }}
      onSubmit={handleSubmit}
      validationSchema={addressSchema}
    >
      <Form className="flex flex-col gap-6">
        <FormInput name="nomeCompleto" label="Nome completo" />
        <FormInput name="cpf" label="CPF" />
        <Button type="submit" variant="contained" className="button">
          Registrar
        </Button>
      </Form>
    </Formik>
  );
}
