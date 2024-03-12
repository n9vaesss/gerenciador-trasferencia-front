import React from 'react';
import Drawer from '../components/drawer/Drawer';
import Conteiner from '../components/Conteiner';
import Loading from '../components/Loading';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-svw h-svh">
      <Loading />
      <Drawer>
        <Conteiner>{children}</Conteiner>
      </Drawer>
    </div>
  );
}
