import { Navigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";

function RequireAuth({ children }) {
    const { authed } = useAuthContext();
    return authed === true ? children : <Navigate to="/login" replace />;
}

export default RequireAuth;