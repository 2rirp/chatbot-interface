import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { IResponse } from '../../views/reportPage/ReportPage';
interface IProps {
    fetchedData : IResponse[];
}
function createData(data : string, quantidade : string, redirected : string, emitidas : string, percentage : number) {
    percentage = Number(emitidas) / Number(quantidade) * 100
    const fixed = percentage.toFixed(2);
  return { data, quantidade, redirected, emitidas, fixed };
}

export default function DataTable(props: IProps) {
    const rows = props.fetchedData.map((item) => {
        return createData(
            item.data || '',
            item.quantidade || "0",
            item.redirected || "0",
            item.emitidas || "0",
            item.percentage || 0,
        );
    })
  
;
  return (
    <TableContainer component={Paper} >
      <Table sx={{ minWidth: 650, fontSize: "30px" }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Data</TableCell>
            <TableCell align="right">Conversas</TableCell>
            <TableCell align="right">Redirecionadas</TableCell>
            <TableCell align="right">Emitidas</TableCell>
            <TableCell align="right">Emitidas (%)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.data}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.data}
              </TableCell>
              <TableCell align="right">{row.quantidade}</TableCell>
              <TableCell align="right">{row.redirected}</TableCell>
              <TableCell align="right">{row.emitidas}</TableCell>
              <TableCell align="right">{row.fixed}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
