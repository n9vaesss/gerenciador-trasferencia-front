'use client';

import React, { useEffect, useState } from 'react';
import { useMyContext } from '../contexts/MyContext';
import FaixaDescricao from './FaixaDescricao';
import Loading from './Loading';

export default function Conteiner({ children }: any) {
  const { titulo }: any = useMyContext();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      {loading ? (
        <Loading />
      ) : (
        <>
          <FaixaDescricao descricao={titulo} />
          <div className="w-nn flex rounded border-2 border-minhaCorAzul mt-5 pt-2 pl-2 pr-2">
            {children}
          </div>
        </>
      )}
    </div>
  );
}
