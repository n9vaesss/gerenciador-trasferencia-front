'use client';

import { useMyContext } from '@/app/contexts/MyContext';
import { Autocomplete, Button, TextField } from '@mui/material';
import Cookie from 'js-cookie';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import TransferList from '../transferList/TransferListRoles';

interface Usuario {
  label: string;
  year: number;
  local: string;
}

export default function InsercaoUsuario() {
  const { setLoad }: any = useMyContext();
  const token = Cookie.get('auth_token');

  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState<Usuario | null>(
    null,
  );
  const [usuarioRoles, setUsuarioRoles] = useState(null);
  const [todasRoles, setTodasRoles] = useState(null);

  useEffect(() => {
    const buscarTodosUsuarios = async () => {
      try {
        setLoad(true);
        const response = await axios.get(`http://89.116.73.130:8080/usuarios`, {
          headers: {
            Authorization: token,
          },
        });

        const usuariosFormatados: Usuario[] = response.data.map(
          (usuario: any) => ({
            label: usuario.username,
            year: usuario.id,
            local: usuario.lojaDeRegistro,
          }),
        );
        setUsuarios(usuariosFormatados);
      } catch (error) {
        console.log(error);
      } finally {
        setLoad(false);
      }
    };

    buscarTodosUsuarios();
  }, []);

  const handleBuscarInfo = async () => {
    if (usuarioSelecionado && usuarioSelecionado.label) {
      const handleRequestRoles = async () => {
        const token = Cookie.get('auth_token');
        try {
          setLoad(true);
          const response = await axios.get(
            `http://89.116.73.130:8080/usuarios/${usuarioSelecionado.label}`,
            {
              headers: {
                Authorization: token,
              },
            },
          );

          const rolesFormatadas = response.data.roles.map(
            (role: any) => role.nome,
          );

          const buscarTodasRoles = async () => {
            const token = Cookie.get('auth_token');
            try {
              setLoad(true);
              const response = await axios.get(
                `http://89.116.73.130:8080/roles`,
                {
                  headers: {
                    Authorization: token,
                  },
                },
              );

              const todasRolesFormatadas = response.data.map(
                (role: any) => role.nome,
              );

              const novoArray = todasRolesFormatadas.filter(
                (valor: any) => !rolesFormatadas.includes(valor),
              );

              setUsuarioRoles(rolesFormatadas);
              setTodasRoles(novoArray);
            } catch (error) {
              console.log(error);
            } finally {
              setLoad(false);
            }
          };

          buscarTodasRoles();
        } catch (error) {
          console.log(error);
        } finally {
          setLoad(false);
        }
      };
      await handleRequestRoles();
    } else {
      setUsuarioRoles(null);
    }
  };

  return (
    <div className="my-5 flex flex-col gap-3">
      <div className="flex gap-6 min-w-96">
        <Autocomplete
          disablePortal
          id="combo-box-demo"
          options={usuarios}
          sx={{ width: 300 }}
          getOptionLabel={(option) => option.label}
          renderInput={(params) => <TextField {...params} label="Usuarios" />}
          onChange={(event, newValue: Usuario | null) => {
            setUsuarioSelecionado(newValue);
          }}
        />
        <Button
          variant="contained"
          className="button"
          onClick={handleBuscarInfo}
        >
          Buscar informações
        </Button>
      </div>
      {usuarioRoles !== null ? (
        <div className="flex flex-col gap-3">
          <TransferList
            usuarioRoles={usuarioRoles}
            todasRoles={todasRoles}
            usuarioSelecionado={usuarioSelecionado}
          />
        </div>
      ) : null}
    </div>
  );
}
