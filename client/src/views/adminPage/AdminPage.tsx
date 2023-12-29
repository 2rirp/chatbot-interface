import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { IAttendant } from '../../interfaces/iuser';
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Avatar } from '@mui/material';
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import "./adminPage.css"
import CustomIconButton from '../../components/customIconButton/CustomIconButton';

// interface AdminProps {
//   onClick: ()=> void;
// }

function AdminPage() {
    const [fetchData, setFetchData] = useState<IAttendant[]>([])
    const [isFetching, setIsFetching] = useState(false);
    const navigate = useNavigate();

    useEffect(()=> {
        const fetchAttendants = async () => {
            setIsFetching(true);
        try {
            const response = await fetch("/api/users/all", {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            })
            if(response.ok) {
                const data = await response.json();
                setFetchData(data.data);
                setIsFetching(false);
                console.log(isFetching);
            }
            
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    fetchAttendants();
    }, []);

    const resetPassword = async (id: number | undefined) => {
      if(id === undefined) {
        alert("Algo deu errado...")
        return
      }
      try {
      const response = await fetch("/api/users/reset-password", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: id
        })
      })
      if(response.ok) {
          alert(`Senha resetada com sucesso!`);
      
        }
      } catch (error) {
          console.error('Error fetching data:', error);
      }
    }

    return (
        <div>
          <div className="main-admin-container">
            <div className="header">
            <CustomIconButton onClick={() => navigate("/")}>
              <Avatar sx={{ width: 32, height: 32, color: "#272727" }}>
                <ArrowBackIcon />
              </Avatar>
            </CustomIconButton>
            <h1>Painel de Controle</h1>
          </div>   
        {fetchData ? (
          <div className="admin-table-container">
          <TableContainer component={Paper} sx={{minWidth: 950, borderRadius: "6px ", border: "solid #e2e2e2 1px", boxShadow: "var(--shadow-box)"}}>
            <Table sx={{ minWidth: "auto", fontSize: "60px"}} aria-label="simple table">
              <TableHead sx={{backgroundColor: "var(--primary-blue)", fontSize: '60px', fontWeight: 600}}>
                <TableRow>
                  <TableCell>id</TableCell>
                  <TableCell align="right">Nome</TableCell>
                  <TableCell align="right">Credenciais</TableCell>
                  <TableCell align='center'>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                  {fetchData.map(row => (
                  <TableRow
                    key={row.id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row.id}
                    </TableCell>
                    <TableCell align="right">{row.name}</TableCell>
                    <TableCell align="right">{row.email}</TableCell>
                    {row.updated_at !== null ? (
                    <TableCell align='center'>
                      <button key={row.id} onClick={()=>resetPassword(row.id)}>Resetar senha</button>
                    </TableCell>
                    ) : (
                    <TableCell align='center'><button key={row.id} disabled>Senha já resetada.</button></TableCell>)
                  }
                  </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          </div>
        ) : (
          <h1>Não foi possível acessar a página.</h1>
        )}
      </div>
    </div>
    )
}


export default AdminPage
