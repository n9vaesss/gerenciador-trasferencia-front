'use client';

// Page.js
import React from 'react';
import { Form, Formik } from 'formik';
import * as yup from 'yup';
import useLoginUser from './hooks/useLoginUser';
import FormInput from './components/FormInput';
import { Button } from '@mui/material';

export default function Page() {
  const { load, handleRequest } = useLoginUser();

  const addressSchema = yup.object().shape({
    email: yup
      .string()
      .required('Preencha todos os campos!')
      .max(70, 'Máximo de caracteres excedido (70)'),
    senha: yup
      .string()
      .required('Preencha todos os campos!')
      .max(70, 'Máximo de caracteres excedido (70)'),
  });

  const handleSubmit = async (values: any) => {
    const apiUrl = 'http://89.116.73.130:8080/login';
    const userData = {
      username: values.email,
      password: values.senha,
    };

    await handleRequest(apiUrl, userData);
  };

  return (
    <div className="w-svw h-svh flex justify-center items-center">
      <Formik
        initialValues={{
          email: '',
          senha: '',
        }}
        onSubmit={handleSubmit}
        validationSchema={addressSchema}
      >
        <Form className="flex flex-col gap-5 -mt-48 min-w-96">
          <FormInput name="email" label="Email" />
          <FormInput name="senha" label="Senha" type="password" />
          <Button type="submit" variant="contained" className="button">
            {load ? 'Entrando' : 'Entrar'}
          </Button>
        </Form>
      </Formik>
    </div>
  );
}
