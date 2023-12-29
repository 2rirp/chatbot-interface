import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ILogin } from "../../interfaces/ilogin";
import "./loginComponent.css";
import { UserContext } from "../../contexts/UserContext";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

export default function LoginComponent() {
  const userContext = useContext(UserContext);
  const navigate = useNavigate();
  const [isFetching, setIsFetching] = useState(false);
  const [changePassword, setChangePassword] = useState(false);

  /*  const [modalIsOpen, setmodalIsOpen] = useState(false); */

  const user = {
    id: userContext?.user?.id || 0,
    username: userContext?.user?.name || "",
    email: userContext?.user?.email || "",
    updatedAt: userContext?.user?.updated_at || null,
    isAdmin: userContext?.user?.is_admin || false,
    isAttendant: userContext?.user?.is_attendant || false,
    isLecturer: userContext?.user?.is_lecturer || false,
  };

  async function formSubmitted(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (isFetching === true) return;
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
    if (isLoggedIn || isLoggedIn === null) {
      if (passwordExpired(isLoggedIn) === false) navigate("/");
      else {
        setChangePassword(true);
      }
    }
  }
  const passwordExpired = (updatedAt: string | null) => {
    const lastUpdate = updatedAt;

    if (lastUpdate === undefined || lastUpdate === null) {
      return true;
    }
    const days = 120;
    const options = { timeZone: "America/Sao_Paulo" };
    const date = new Date().toLocaleString("en-US", options);
    const today = new Date(date);
    const lastUpdateDate = new Date(lastUpdate);
    today.setHours(0, 0, 0, 0);
    lastUpdateDate.setHours(0, 0, 0, 0);

    const timeDifference = today.getTime() - lastUpdateDate.getTime();
    const difference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    console.log(today, lastUpdateDate, timeDifference, difference);
    if (difference >= days) return true;
    else return false;
  };

  async function newPasswordSubmitted(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isFetching === true) return;
    const data = new FormData(event.currentTarget);
    const password = data.get("password");
    const confirmPassword = data.get("confirmPassword");
    const email = user.email;
    if (password === null || password === "") {
      alert("Há dados incompletos, por favor, preencha-os!");
      return;
    }
    if (confirmPassword === null || confirmPassword === "") {
      alert("Há dados incompletos, por favor, preencha-os!");
      return;
    } else if (
      password === confirmPassword &&
      password !== null &&
      password !== ""
    ) {
      const passwordChanged = await userContext?.update(
        String(email),
        String(password)
      );
      setIsFetching(false);
      if (passwordChanged) {
        setChangePassword(false);
        alert("Senha alterada com sucesso!");
        navigate("/");
      }
    } else if (password !== confirmPassword) {
      alert("As senhas devem coincidir. Por favor, confira-as.");
      return;
    }
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
    <div className="login-container">
      {changePassword ? (
        <div className="loginBox">
          <h1 className="">Trocar senha</h1>

          <Box
            component="form"
            onSubmit={newPasswordSubmitted}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              id="password"
              label="Nova senha"
              type="password"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              id="confirmPassword"
              label="Confirmar nova"
              type="password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Salvar
            </Button>
          </Box>
          <p>
            Seguindo as diretrizes de segurança da Serventia, é necessário a
            troca de senha dentro de um período de 120 dias. Por favor, mantenha
            sua senha consigo e segura.
          </p>
        </div>
      ) : (
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
      )}
    </div>
  );
}
