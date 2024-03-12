import React from 'react';
import { Form, Formik } from 'formik';
import * as yup from 'yup';
import FormInput from '../FormInput';
import { Button } from '@mui/material';
import { useMyContext } from '@/app/contexts/MyContext';
import axios from 'axios';
import Cookie from 'js-cookie';
import { toast } from 'react-toastify';
import FormSelect from '../FormSelect';

export default function AdmInserirUsuario() {
  const { setLoad, setFecharModal, fecharModal }: any = useMyContext();
  const token = Cookie.get('auth_token');

  const addressSchema = yup.object().shape({
    email: yup
      .string()
      .required('Preencha todos os campos!')
      .max(70, 'Máximo de caracteres excedido (70)'),
    senha: yup
      .string()
      .required('Preencha todos os campos!')
      .max(70, 'Máximo de caracteres excedido (70)'),
    lojaDeRegistro: yup
      .string()
      .required('Preencha todos os campos!')
      .max(70, 'Máximo de caracteres excedido (70)'),
  });

  const handleSubmit = async (values: any) => {
    const dadosUsuario = {
      username: values.email,
      password: values.senha,
      lojaDeRegistro: values.lojaDeRegistro,
      roles: [
        {
          id: 2,
          nome: 'USUARIO',
        },
      ],
    };

    try {
      setLoad(true);
      await axios.post('http://89.116.74.67:8080/usuarios', dadosUsuario, {
        headers: {
          Authorization: token,
        },
      });
      toast.success('Novo usuario inserido!');
    } catch (erro) {
      toast.error('Algo deu errado!');
      console.log(erro);
    } finally {
      setLoad(false);
      setFecharModal(!fecharModal);
      values.email = '';
      values.senha = '';
      values.lojaDeRegistro = '';
    }
  };

  return (
    <div className="flex">
      <Formik
        initialValues={{
          email: '',
          senha: '',
          lojaDeRegistro: '',
        }}
        onSubmit={handleSubmit}
        validationSchema={addressSchema}
      >
        <Form className="flex flex-col gap-5 pt-5 pb-5 min-w-96">
          <FormInput name="email" label="Email" />
          <FormInput name="senha" label="Senha" />
          <FormSelect
            name="lojaDeRegistro"
            options={[
              { label: 'Loja 1', value: 'LOJA_1' },
              { label: 'Loja 2', value: 'LOJA_2' },
              { label: 'Loja 3', value: 'LOJA_3' },
              { label: 'Loja 4', value: 'LOJA_4' },
              { label: 'Loja 5', value: 'LOJA_5' },
              { label: 'Loja 6', value: 'LOJA_6' },
            ]}
            label="Selecione a loja de registro"
            tamanho={220}
          />
          <Button type="submit" variant="contained" className="button">
            Enviar
          </Button>
        </Form>
      </Formik>
    </div>
  );
}
