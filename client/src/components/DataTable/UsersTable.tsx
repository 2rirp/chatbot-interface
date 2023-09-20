/* eslint-disable @typescript-eslint/no-misused-promises */
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

interface IReportUsers {
  id: number;
  date?: string;
  user_id?: string;
  status?: string;
}

interface IProps {
    fetchedData : IReportUsers[];
}

function createData(id: number, date : string, user_id : string, status : string) {
  return { id, date, user_id, status };
}

export default function UsersTable(props: IProps) {
    const rows = props.fetchedData.map((item) => {
        return createData(
            item.id,
            item.date || '',
            item.user_id || "0",
            item.status || "0"
        );
    });

    
  

  return (
    <TableContainer component={Paper} >
      <Table sx={{ minWidth: 650, fontSize: "30px" }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell >Conversa (id)</TableCell>
            <TableCell align="right">Horário</TableCell>
            <TableCell align="right">Usuário</TableCell>
            <TableCell align="right">Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.id}
              </TableCell>
              <TableCell align="right">{row.date}</TableCell>
              <TableCell align="right">{row.user_id}</TableCell>
              <TableCell align="right">{row.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
