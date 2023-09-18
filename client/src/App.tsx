import "./App.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import ChatPage from "./views/chatPage/ChatPage";
import LoginPage from "./views/loginPage/LoginPage";
import { RequireAuth } from "./components/AuthComponents/RequireAuth";
import RealTimePage from "./views/realTimePage/RealTimePage";
import { RequireAdminAuth } from "./components/AuthComponents/RequireAdminAuth";
import ReportPage from "./views/reportPage/ReportPage";

export default function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <RequireAuth>
          <RealTimePage />
        </RequireAuth>
      ),
    },

    {
      path: "/login",
      element: <LoginPage />,
    },

    {
      path: "/chatpage",
      element: (
        <RequireAuth>
          <RequireAdminAuth>
            <ChatPage />
          </RequireAdminAuth>
        </RequireAuth>
      ),
    },
    {
      path: "/relatorio",
      element: (
        <RequireAuth>
          <RequireAdminAuth>
            <ReportPage/>
          </RequireAdminAuth>
        </RequireAuth>
      ),
    },
  ]);

  return <RouterProvider router={router} />;
}
