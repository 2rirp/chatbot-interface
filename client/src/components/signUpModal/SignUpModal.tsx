import { UserContext } from "../../contexts/UserContext";
import "./signUpModal.css";
import { useContext, useState } from "react";

interface SignUpModalProps {
  onClose: () => void;
}

export default function SignUpModal(props: SignUpModalProps) {
  const userContext = useContext(UserContext);
  const [isFetching, setIsFetching] = useState(false);
  const [nameValue, setNameValue] = useState("");
  const [emailValue, setEmailValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [confirmPasswordValue, setConfirmPasswordValue] = useState("");
  const [adminValue, setAdminValue] = useState(false);
  const [attendantValue, setAttendantValue] = useState(false);
  const [lecturerValue, setLecturerValue] = useState(false);
  

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNameValue(e.target.value);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmailValue(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordValue(e.target.value);
  };
  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmPasswordValue(e.target.value);
  };
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    switch(e.target.name) {
      case "admin-checkbox": setAdminValue(e.target.checked);
    break;
      case "lecturer-checkbox": setLecturerValue(e.target.checked);
    break;
      case "attendant-checkbox": setAttendantValue(e.target.checked);
    break;
    }
  };

  function stopPropagation(e: React.MouseEvent<HTMLDivElement>) {
    e.stopPropagation();
  }

  async function compareCredentials() {
    if(isFetching === true)
      return;
    const name = nameValue.trim();
    const email = emailValue.trim();
    const password = passwordValue.trim();
    const confirmPassword = confirmPasswordValue.trim();
    const admin = adminValue;
    const attendant = attendantValue;
    const lecturer = lecturerValue;
    if (
      name === "" ||
      email === "" ||
      password === "" ||
      confirmPassword === ""
    ) {
      alert(`Favor preencher todos os campos de cadastro.`);
    } else {
      if (confirmPassword === password) {
        const newUser = {
          name: name,
          email: email,
          password: password,
          is_admin: admin,
          is_attendant: attendant,
          is_lecturer: lecturer
        };

        await userContext?.register(
          String(newUser.name!),
          String(newUser.email!),
          String(newUser.password!),
          newUser.is_admin!,
          newUser.is_attendant!,
          newUser.is_lecturer!
        );
        setIsFetching(false);
      } else alert("As senhas devem ser iguais.");
    }
  }

  return (
    <div className="modal-background" onClick={props.onClose}>
      <div className="form-container" onClick={stopPropagation}>
        <form action="">
          <div className="input-container">
            <h2>Cadastro</h2>
            <label htmlFor="name-input">Name: </label>
            <input
              type="text"
              className="default-input"
              name="name-input"
              onChange={handleNameChange}
            />
            <label htmlFor="email-input">Credenciais de acesso: </label>
            <input
              type="text"
              className="default-input"
              name="email-input"
              onChange={handleEmailChange}
            />
            <label htmlFor="password-input">Password: </label>
            <input
              type="password"
              className="default-input"
              name="password-input"
              onChange={handlePasswordChange}
            />
            <label htmlFor="confirm-password-input">Confirm password: </label>
            <input
              type="password"
              className="default-input"
              name="confirm-password-input"
              onChange={handleConfirmPasswordChange}
            />
            <div className="checkbox-container">
              <label htmlFor="admin-checkbox">Admin?</label>
              <input className="default-checkbox"
                type="checkbox"
                name="admin-checkbox"
                onChange={handleCheckboxChange}
              />
              <label htmlFor="attendant-checkbox">Atendente?</label>
              <input className="default-checkbox"
                type="checkbox"
                name="attendant-checkbox"
                onChange={handleCheckboxChange}
              />
              <label htmlFor="lecturer-checkbox">Conferente/qualificador?</label>
              <input className="default-checkbox"
                type="checkbox"
                name="lecturer-checkbox"
                onChange={handleCheckboxChange}
              />
            </div>
          </div>
          <div className="button-container">
            <button
              className="signup-button"
              type="button"
              onClick={compareCredentials}
            >
              Cadastrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
