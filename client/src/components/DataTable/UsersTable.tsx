/* eslint-disable @typescript-eslint/no-misused-promises */
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import PhoneNumberFormatter from "../phoneNumberFormatter/PhoneNumberFormatter";

interface IReportUsers {
  id: number;
  date?: string;
  user_id?: string;
  status?: string;
  emitida: boolean | string;
  regist_count: number;
}

interface IProps {
  fetchedData: IReportUsers[];
}

function createData(
  id: number,
  date: string,
  user_id: string,
  status: string,
  emitida: boolean | string,
  regist_count: number
) {
  return { id, date, user_id, status, emitida, regist_count };
}

export default function UsersTable(props: IProps) {
  const rows = props.fetchedData.map((item) => {
    switch (item.status) {
      case "talking_to_attendant":
        item.status = "Falando com atendente";
        break;
      case "active":
        item.status = "Em andamento";
        break;
      case "inactive":
        item.status = "Conversa encerrada";
        break;
      case "waiting_payment":
        item.status = "Aguardando pagamento";
        break;
      case "confirmed_payment":
        item.status = "Pagamento confirmado";
        break;
      default:
        item.status;
        break;
    }
    if (item.emitida === true) item.emitida = "Sim";
    else if (item.emitida === false) item.emitida = "Não";

    return createData(
      item.id,
      item.date || "",
      item.user_id || "0",
      item.status || "0",
      item.emitida,
      item.regist_count || 0
    );
  });

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650, fontSize: "30px" }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Conversa (id)</TableCell>
            <TableCell align="right">Horário</TableCell>
            <TableCell align="right">Usuário</TableCell>
            <TableCell align="right">Status</TableCell>
            <TableCell align="right">Emitida</TableCell>
            <TableCell align="right">Quantidade</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.id}
              </TableCell>
              <TableCell align="right">{row.date}</TableCell>
              <TableCell align="right">
                <PhoneNumberFormatter phoneNumber={row.user_id} />
              </TableCell>
              <TableCell align="right">{row.status}</TableCell>
              <TableCell align="right">{row.emitida}</TableCell>
              <TableCell align="right">{row.regist_count}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
