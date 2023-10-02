/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { useState } from "react";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
/* import Button from "@mui/material/Button"; */
import DateInput from "../../components/dateInput/DateInput";
import "./reportPage.css";
import DataTable from "../../components/DataTable/DataTable";
import Modal from "../../components/DataTable/modal/modal";

export interface IResponse {
  data?: string;
  quantidade?: string;
  redirected?: string;
  emitidas?: string;
  percentage?: any;
}

interface IReportUsers {
  id: number;
  date?: string;
  user_id?: string;
  status?: string;
  emitida: boolean;
}

export default function ReportPage() {
  const [selectedDate, setDate] = useState<string>("");
  const [fetchedData, setFetchedData] = useState<Array<IResponse>>([]);
  const [usersData, setUsersData] = useState<Array<IReportUsers>>([]);
  const [modalIsOpen, setmodalIsOpen] = useState(false);
  const [hasFetchedData, setHasFetchedData] = useState(false);
  const navigate = useNavigate();

  async function fetchDataByDate(date: string) {
    try {
      if (selectedDate === "") {
        alert("Nenhuma data selecionada.");
        return;
      }
      const obj = await fetch(`/api/reports/${date}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const response = await obj.json();
      if (obj.ok) {
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
    } catch (error: any) {
      console.error(error);
    }
  }
  async function fetchData() {
    try {
      const obj = await fetch(`/api/r/reports/all`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const response = await obj.json();
      if (obj.ok) {
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
      console.error(error);
    }
  }
  async function fetchUsers(date: string) {
    try {
      const users = await fetch(`/api/reports/users/${date}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const response = await users.json();
      if (users.ok) {
        if (response.data) {
          console.log("Response.data: ", response.data);
          setUsersData(response.data);
        }
      } else {
        console.log(response.error);
        throw response.error;
      }
    } catch (error) {
      console.error(error);
    }
  }

  function handleDateChange(date: string) {
    setDate(date);
  }
  function closeModal() {
    setmodalIsOpen(false);
  }

  async function openModal(date: string) {
    const data = await fetchUsers(date);
    console.log("usersData: ", usersData, "\n\nData: ", data);
    setmodalIsOpen(true);
  }

  return (
    <>
      <div className="reports-page-container">
        {modalIsOpen && <Modal onClose={closeModal} data={usersData} />}
        <div className="header-container">
          <div className="header">
            <div className="button-div">
              <IconButton onClick={() => navigate("/")}>
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
        <div className="table-container"></div>
        <div className="date-inputs">
          <DateInput handleDateChange={handleDateChange} />
        </div>
        <div className="button-inputs">
          <button
            className="fetch-button"
            onClick={() => fetchDataByDate(selectedDate)}
          >
            Buscar por data
          </button>
          <button className="fetch-button" onClick={() => fetchData()}>
            Visualizar todas
          </button>
        </div>
        <div className="fetched-container">
          {hasFetchedData ? (
            <DataTable fetchedData={fetchedData} modal={openModal} />
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
