import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { useMyContext } from '@/app/contexts/MyContext';

const style = {
  position: 'absolute',
  top: '40%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function BasicModal({
  compoentModal,
  tituloComponente,
  textoBotao,
}: any) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { fecharModal }: any = useMyContext();

  React.useEffect(() => {
    setOpen(false);
  }, [fecharModal]);

  return (
    <div className="flex">
      <Button className="button" onClick={handleOpen} variant="contained">
        {textoBotao}
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="flex flex-col gap-6">
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            className="text-center button rounded-md p-4"
          >
            {tituloComponente}
          </Typography>
          {compoentModal}
        </Box>
      </Modal>
    </div>
  );
}
