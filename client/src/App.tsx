import { useState } from "react";
import "./App.css";
import ChatPage from "./Components/chatPage/ChatPage";
import LoginPage from "./Components/loginPage/LoginPage";

function App() {
  const [currentPage, setCurrentPage] = useState("login");

  function handleLoginSuccess(isLoggedIn: boolean) {
    setCurrentPage(isLoggedIn ? "main" : "login");
  }

  return (
    <div className="App">
      {currentPage === "login" && (
        <LoginPage onLoginSuccess={handleLoginSuccess} />
      )}
      {currentPage === "main" && <ChatPage />}
    </div>
  );
}

export default App;
