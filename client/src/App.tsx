import { useState } from "react";
import "./App.css";
import HomePage from "./Components/homePage/HomePage";
import LoginPage from "./Components/loginPage/LoginPage";

function App() {
  const [currentPage, setCurrentPage] = useState("login");

  function handleLoginSuccess(isLoggedIn: boolean) {
    setCurrentPage(isLoggedIn ? "home" : "login");
  }

  return (
    <div className="App">
      {currentPage === "login" && (
        <LoginPage onLoginSuccess={handleLoginSuccess} />
      )}
      {currentPage === "home" && <HomePage />}
    </div>
  );
}

export default App;
