'use client';

import { useRouter } from 'next/navigation';
import Cookie from 'js-cookie';
import axios from 'axios';
import React from 'react';
import { toast } from 'react-toastify';

const useClient = () => {
  const router = useRouter();
  const [load, setLoad] = React.useState(false);

  const handleRequest = async (apiUrl: any, userData: any) => {
    try {
      setLoad(true);
      const response = await axios.post(apiUrl, userData);

      console.log(response)
      if (response.status === 200) {
        Cookie.set('auth_token', response.headers.authorization);
        const handleRequestRoles = async (userData: any) => {
          const token = Cookie.get('auth_token');
          try {
            const response = await axios.get(
              `http://89.116.74.67:8080/usuarios/${userData.username}`,
              {
                headers: {
                  Authorization: token,
                },
              },
            );
            for (let i = 0; i < response.data.roles.length; i++) {
              Cookie.set(`role_user${i}`, response.data.roles[i].nome);
            }
            Cookie.set('username', response.data.username);
            Cookie.set('loja_registro', response.data.lojaDeRegistro);
          } catch (error) {
            for (let i = 0; i < response.data.roles.length; i++) {
              Cookie.remove(`role_user${i}`);
            }
            Cookie.remove('auth_token');
            Cookie.remove('username');
            Cookie.remove('loja_registro');
            console.log(error);
          }
        };
        handleRequestRoles(userData);
        toast.success('Usuario logado!');
        router.push('/dashboard');
      }
    } catch (error: any) {
      if (error.response.status === 401) {
        toast.error('Usuario ou senha incorretos!');
      } else {
        toast.error('Algo deu errado');
      }
      Cookie.remove('auth_token');
      console.log(error);
    } finally {
      setLoad(false);
    }
  };

  return { load, handleRequest };
};

export default useClient;
