import "./App.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import ChatPage from "./views/chatPage/ChatPage";
import LoginPage from "./views/loginPage/LoginPage";
import { RequireAuth } from "./components/requireAuth/RequireAuth";
import RealTimePage from "./views/realTimePage/RealTimePage";

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
          <ChatPage />
        </RequireAuth>
      ),
    },
  ]);

  return <RouterProvider router={router} />;
}
