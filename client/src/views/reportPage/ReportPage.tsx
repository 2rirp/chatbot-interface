
import { useEffect, useState } from "react";
import IconButton from "@mui/material/IconButton";
import Avatar from '@mui/material/Avatar';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from "react-router-dom";
import  Button  from "@mui/material/Button";
import DateInput from "../../components/dateInput/DateInput";
import "./reportPage.css";
import DataTable from "../../components/DataTable/DataTable";


export interface IResponse {
    data?: string;
    quantidade?: string,
    redirected?: string,
    emitidas?: string;
    percentage?: any;
}

export default function ReportPage() {
    const[selectedDate, setDate] = useState<string>('');
    const [fetchedData, setFetchedData] = useState<Array<IResponse>>([])
    const [hasFetchedData, setHasFetchedData] = useState(false);
    const navigate = useNavigate();


    async function fetchDataByDate(date: string) {
        try {
                const obj = await fetch(`/api/reports/${date}`, {
                method: "GET",
                // body: {
                //     options: options
                // },
                headers: {
                "Content-Type": "application/json",
                }});
                const response = await obj.json();
                if(obj.ok) {
                if (response.data) {
                    setFetchedData(response.data);
                    console.log("Fetched data: ", fetchedData);
                    setHasFetchedData(true);
                } else {
                    console.error("No reports found: ", response.data);
                }
            } else {
                throw response.error;
            }

        } catch(error: any) {
            console.error(error)
        }
    }
    async function fetchData() {
        try {
            const obj = await fetch(`/api/r/reports/all`, {
                method: "GET",
                // body: {
                //     options: options
                // },
                headers: {
                "Content-Type": "application/json",
                }});
                const response = await obj.json();
                if(obj.ok) {
                if (response.data) {
                    setFetchedData(response.data);
                    console.log("Fetched data: ", fetchedData);
                    setHasFetchedData(true);
                } else {
                    console.error("No reports found: ", response.data);
                }
            } else {
                throw response.error;
            }
        } catch (error) {
            console.error(error)
        }
    }

    function handleDateChange(date: string) {
        setDate(date);
      }
      useEffect(() => {
        if (selectedDate !== "") {
            fetchDataByDate(selectedDate);
          }
      }, [selectedDate])

    return (
        <>
       <div className="container">
            <div className="header-container">
                <div className="header">
                    <div className="button-div">
                    <IconButton
                        onClick={()=>navigate("/")}
                    >
                    <Avatar sx={{ width: 32, height: 32, color: "#272727" }}>
                    <ArrowBackIcon />
                    </Avatar>
                    </IconButton>
                    </div>
                    <div className="title-div">
                        <h1>Relatórios</h1>
                        
                    </div>
                </div>
            </div>
        <div className="table-container">
            
        </div>
        <div className="date-inputs">
            <DateInput handleDateChange={handleDateChange}/>
            </div>
            <div className="button-inputs">
                <Button onClick={()=>fetchData()} variant="text">FETCH</Button>
            </div>
<div className="fetched-container">
  {hasFetchedData ? (
    <DataTable fetchedData={fetchedData} />
  ) : (
    <div className="centered-message-container">
      <p className="centered-message">Nenhum relatório encontrado.</p>
    </div>
  )}
</div>
</div>
</>
);
}