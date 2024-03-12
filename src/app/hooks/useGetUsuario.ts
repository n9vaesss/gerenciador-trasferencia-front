import { useState, useEffect } from 'react';
import axios from 'axios';
import { useMyContext } from '../contexts/MyContext';
import Cookie from 'js-cookie';

const useUsuario = (username: any) => {
  const [usuario, setUsuario] = useState(null);
  const [error, setError] = useState(null);
  const { setLoad }: any = useMyContext();

  const token = Cookie.get('auth_token');

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        setLoad(true);
        const response = await axios.get(
          `http://89.116.74.67:8080/usuarios/${username}`,
          {
            headers: {
              Authorization: token,
            },
          },
        );
        const data = response.data;

        if (response.status !== 200) {
          throw new Error(data.error || 'Erro na solicitação');
        }

        setUsuario(data);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoad(false);
      }
    };

    if (username) {
      fetchUsuario();
    }
  }, [username]);

  const getUsuario = () => usuario;
  const getError = () => error;

  return { getUsuario, getError };
};

export default useUsuario;
