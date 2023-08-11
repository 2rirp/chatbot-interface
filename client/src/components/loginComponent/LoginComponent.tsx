import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ILogin } from "../../interfaces/ilogin";
import "./loginComponent.css";
import { UserContext } from "../../contexts/UserContext";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

export default function LoginComponent() {
  const userContext = useContext(UserContext);
  const navigate = useNavigate();
  const [isFetching, setIsFetching] = useState(false);

  /*  const [modalIsOpen, setmodalIsOpen] = useState(false); */

  async function formSubmitted(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    
    if(isFetching === true)
      return;
    const data = new FormData(e.currentTarget);

    const credentials: ILogin = {
      email: data.get("email"),
      password: data.get("password"),
    };

    if (credentials.email === null || credentials.email === "") {
      alert("Insira as credenciais de acesso.");
      return;
    }

    if (credentials.password === null || credentials.password === "") {
      alert("Insira uma senha.");
      return;
    }

    const isLoggedIn = await userContext?.login(
      String(credentials.email),
      String(credentials.password)
    );
    setIsFetching(false);
    if (isLoggedIn) navigate("/");
  }

  /* function closeModal() {
    setmodalIsOpen(false);
  } */

  /* const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmailValue(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordValue(e.target.value);
  }; */

  return (
    <div className="container">
      <div className="loginBox">
        <h1 className="loginTitle">Login</h1>
        <Box
          component="form"
          onSubmit={formSubmitted}
          noValidate
          sx={{ mt: 1 }}
        >
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Credenciais de acesso"
            name="email"
            autoComplete="email"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Senha"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Login
          </Button>
        </Box>
      </div>
    </div>
  );
}
