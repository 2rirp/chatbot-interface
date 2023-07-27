import { useState } from "react";
import { ILogin } from "../../interfaces/ilogin";
import { HTTPRequest } from "../../utils/HTTPRequest";
import "./loginPage.css";
import Modal from "../modal/Modal";
import HomePage from "../homePage/HomePage";
import Form from "../form/Form";

interface LoginProps {
  onLoginSuccess: (isLoggedIn: boolean) => void;
}

export default function LoginPage(props: LoginProps) {
  const [modalIsOpen, setmodalIsOpen] = useState(false);
  const [emailValue, setEmailValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  async function formSubmitted(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const email = emailValue;
    const password = passwordValue;

    const user: ILogin = { email, password };

    const response = await HTTPRequest(
      "http://localhost:5000/login",
      "POST",
      user
    );

    if (response.status === 201) {
      setIsLoggedIn(true);
      props.onLoginSuccess(true);
    } else {
      setmodalIsOpen(true);
    }
  }

  function closeModal() {
    setmodalIsOpen(false);
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmailValue(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordValue(e.target.value);
  };

  return (
    <div className="container">
      {modalIsOpen && <Modal onClose={closeModal} />}
      <div className="loginBox">
        <h1 className="loginTitle">Login</h1>
        {isLoggedIn ? (
          <HomePage />
        ) : (
          <Form
            onSubmit={formSubmitted}
            handleEmailChange={handleEmailChange}
            handlePasswordChange={handlePasswordChange}
          />
        )}
      </div>
    </div>
  );
}
