'use client';
import { createContext, useContext, useState } from 'react';

const MyContext = createContext();

export function MyContextProvider({ children }) {
  const [titulo, setTitulo] = useState(null);
  const [load, setLoad] = useState(false);
  const [fecharModal, setFecharModal] = useState(false);
  const [attTabela, setAttTabela] = useState(false);

  return (
    <MyContext.Provider
      value={{
        titulo,
        setTitulo,
        load,
        setLoad,
        fecharModal,
        setFecharModal,
        attTabela,
        setAttTabela,
      }}
    >
      {children}
    </MyContext.Provider>
  );
}

export function useMyContext() {
  return useContext(MyContext);
}
