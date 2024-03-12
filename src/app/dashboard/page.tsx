'use client';

import React from 'react';
import { useMyContext } from '../contexts/MyContext';

export default function Page() {
  const { setTitulo }: any = useMyContext();

  setTitulo('Pagina Inicial');

  return (
    <div>
      <h1>Bem-vindo a pagina inicial!</h1>
      <h1>Lista de Usuários</h1>
    </div>
  );
}
