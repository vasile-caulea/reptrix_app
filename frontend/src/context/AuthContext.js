import { createContext, useState, useContext } from "react";
import { SignInService, setUserLoggedIn, cleanLocalStorage, getToken } from "../services/Auth";

const authContext = createContext(null);

function useAuth() {
    const [authed, setAuthed] = useState(() => {
        const token = getToken();
        return token !== null;
    });

    const login = async ({ email, password }) => {
        try {
            const response = await SignInService({ email, password });
            console.log("Login response:", response);
            setUserLoggedIn(response.data);
            setAuthed(true);
            return { success: true };
        } catch (error) {
            console.error("Login failed in context:", error);
            throw error;
        }
    };

    const logout = () => {
        return new Promise((res) => {
            cleanLocalStorage();
            setAuthed(false);
            res();
        });
    };

    return {
        authed,
        login,
        logout
    };
}

export function AuthProvider({ children }) {
    const auth = useAuth();

    return (<authContext.Provider value={auth}>{children}</authContext.Provider>);
}

export function useAuthContext() {
    return useContext(authContext);
}