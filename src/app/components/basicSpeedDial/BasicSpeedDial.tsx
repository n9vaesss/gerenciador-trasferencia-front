import React, { useState } from 'react';
import Box from '@mui/material/Box';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import SaveIcon from '@mui/icons-material/Save';
import PrintIcon from '@mui/icons-material/Print';
import * as XLSX from 'xlsx';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

const actions = [
  { icon: <PrintIcon />, name: 'Print' },
];

export default function BasicSpeedDial({ rows }: any) {
  const [openModal, setOpenModal] = useState(false);
  const [multiplier, setMultiplier] = useState(4);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handlePrint = () => {
    handleOpenModal();
  };

  const handlePrintConfirmed = () => {
    let data = [];
    let rowCount = rows.length;
    let multipliedRowCount = rowCount * multiplier;

    rows.forEach((row: any) => {
      data.push({
        numeroNota: row.numeroNota,
        lojaRemetente: row.lojaRemetente,
        lojaDestinatario: row.lojaDestinatario,
        status: row.status,
        entregador: row.entregador_nomeCompleto,
        horaDeRegistro: row.horaDeRegistro,
      });
    });

    // Adicionando a quantidade de registros e a multiplicação ao final dos dados
    data.push({
      numeroNota: 'Total de Registros:',
      lojaRemetente: rowCount,
      lojaDestinatario: 'Registros * ' + multiplier + ':',
      status: multipliedRowCount,
      entregador: '',
      horaDeRegistro: '',
    });

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Data');

    XLSX.writeFile(wb, 'data.xlsx');
    handleCloseModal();
  };

  return (
    <Box
      sx={{
        height: 320,
        transform: 'translateZ(0px)',
        flexGrow: 1,
        position: 'fixed',
        bottom: 10,
        right: 20,
      }}
    >
      <SpeedDial
        ariaLabel="SpeedDial basic example"
        sx={{
          position: 'absolute',
          bottom: 0,
          right: 20,
        }}
        icon={<SpeedDialIcon className="text-blue-600 hover:text-white" />}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={action.name === 'Print' ? handlePrint : undefined}
          />
        ))}
      </SpeedDial>

      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <h2 id="modal-modal-title" className="text-center">
            Entre com o valor unitario da entrega
          </h2>
          <TextField
            label="Multiplicador"
            variant="outlined"
            type="number"
            value={multiplier || 0}
            onChange={(e) => setMultiplier(parseFloat(e.target.value))}
            className="my-4"
          />

          <div className="m-auto">
            <Button onClick={handleCloseModal}>Cancel</Button>
            <Button onClick={handlePrintConfirmed}>Print</Button>
          </div>
        </Box>
      </Modal>
    </Box>
  );
}
