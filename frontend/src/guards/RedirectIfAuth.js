import { Navigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";

function RedirectIfAuth({ children }) {
  const { authed } = useAuthContext();

  return authed === true ? <Navigate to="/" replace /> : children;
}

export default RedirectIfAuth;
