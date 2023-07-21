import { useState } from "react";
import Form from "../form/Form";
import { ILogin } from "../../interfaces/ilogin";
import { HTTPRequest } from "../../utils/HTTPRequest";
import ChatList from "../chatList/Chatlist";
import "./loginPage.css";

export default function LoginPage() {
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
    } else {
      return
    } 
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmailValue(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordValue(e.target.value);
  };

  return (
    <div className="container">
      <div className="loginBox">
        <h1 className="loginTitle">Login</h1>
        {isLoggedIn ? (
          <ChatList />
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
