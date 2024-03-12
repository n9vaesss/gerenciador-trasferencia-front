import * as React from 'react';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Cookie from 'js-cookie';
import axios from 'axios';
import { useMyContext } from '@/app/contexts/MyContext';
import { toast } from 'react-toastify';

function not(a: any, b: any) {
  return a.filter((value: any) => b.indexOf(value) === -1);
}

function intersection(a: any, b: any) {
  return a.filter((value: any) => b.indexOf(value) !== -1);
}

function union(a: any, b: any) {
  return [...a, ...not(b, a)];
}

export default function SelectAllTransferList({
  usuarioRoles,
  todasRoles,
  usuarioSelecionado,
}: any) {
  const [checked, setChecked] = React.useState([]);
  const [left, setLeft] = React.useState(usuarioRoles);
  const [right, setRight] = React.useState([todasRoles]);

  React.useEffect(() => {
    setLeft(usuarioRoles);
    setRight(todasRoles);
  }, [usuarioRoles]);

  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);

  const handleToggle = (value: any) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const numberOfChecked = (items: any) => intersection(checked, items).length;

  const handleToggleAll = (items: any) => () => {
    if (numberOfChecked(items) === items.length) {
      setChecked(not(checked, items));
    } else {
      setChecked(union(checked, items));
    }
  };

  const { setLoad }: any = useMyContext();

  const handleCheckedRight = () => {
    setRight(right.concat(leftChecked));
    setLeft(not(left, leftChecked));
    setChecked(not(checked, leftChecked));
  };

  const handleCheckedLeft = () => {
    setLeft(left.concat(rightChecked));
    setRight(not(right, rightChecked));
    setChecked(not(checked, rightChecked));
  };

  const handleEnviarAtulizarRoles = () => {
    const handleRequestRoles = async () => {
      const token = Cookie.get('auth_token');

      const rolesObjects = left.map((role: any, index: any) => ({
        id: index + 1,
        nome: role,
      }));

      const usuarioData = {
        id: usuarioSelecionado.year,
        username: usuarioSelecionado.label,
        lojaDeRegistro: usuarioSelecionado.local,
        password: '',
        roles: rolesObjects,
      };

      try {
        setLoad(true);
        await axios.put('http://89.116.73.130:8080/usuarios', usuarioData, {
          headers: {
            Authorization: token,
          },
        });
        toast.success('Dados atualizados!');
      } catch (error) {
        toast.error('Algo deu errado!');
      } finally {
        setLoad(false);
      }
    };
    handleRequestRoles();
  };

  const customList = (title: any, items: any) => (
    <Card>
      <CardHeader
        sx={{ px: 2, py: 1 }}
        avatar={
          <Checkbox
            onClick={handleToggleAll(items)}
            checked={
              numberOfChecked(items) === items.length && items.length !== 0
            }
            indeterminate={
              numberOfChecked(items) !== items.length &&
              numberOfChecked(items) !== 0
            }
            disabled={items.length === 0}
            inputProps={{
              'aria-label': 'all items selected',
            }}
          />
        }
        title={title}
        subheader={`${numberOfChecked(items)}/${items.length} selecionado`}
      />
      <Divider />
      <List
        sx={{
          width: 217,
          height: 230,
          bgcolor: 'background.paper',
          overflow: 'auto',
        }}
        dense
        component="div"
        role="list"
      >
        {items.map((value: any) => {
          const labelId = `transfer-list-all-item-${value}-label`;

          return (
            <ListItem
              key={value}
              role="listitem"
              button
              onClick={handleToggle(value)}
            >
              <ListItemIcon>
                <Checkbox
                  checked={checked.indexOf(value) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{
                    'aria-labelledby': labelId,
                  }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={value} />
            </ListItem>
          );
        })}
      </List>
    </Card>
  );

  return (
    <div>
      <Grid container spacing={2} alignItems="center">
        <Grid item>{customList('Permissões obtidas', left)}</Grid>
        <Grid item>
          <Grid container direction="column" alignItems="center">
            <Button
              sx={{ my: 0.5 }}
              variant="outlined"
              size="small"
              onClick={handleCheckedRight}
              disabled={leftChecked.length === 0}
              aria-label="move selected right"
            >
              &gt;
            </Button>
            <Button
              sx={{ my: 0.5 }}
              variant="outlined"
              size="small"
              onClick={handleCheckedLeft}
              disabled={rightChecked.length === 0}
              aria-label="move selected left"
            >
              &lt;
            </Button>
          </Grid>
        </Grid>
        <Grid item>{customList('Permissões obter', right)}</Grid>
      </Grid>
      <Button
        className="button mt-3"
        variant="contained"
        onClick={handleEnviarAtulizarRoles}
      >
        Atualizar informações
      </Button>
    </div>
  );
}
