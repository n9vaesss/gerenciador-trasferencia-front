'use client';

import { useMyContext } from '@/app/contexts/MyContext';
import { Box, CircularProgress } from '@mui/material';

export default function Loading() {
  const { load }: any = useMyContext();

  return (
    <div
      className={
        load === true
          ? 'absolute bg-minhaCorFundo w-full h-full z-50 top-0 right-0 flex items-center justify-center'
          : 'hidden'
      }
    >
      <Box sx={{ display: 'flex' }}>
        <CircularProgress />
      </Box>
    </div>
  );
}
