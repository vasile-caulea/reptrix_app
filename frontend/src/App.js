import { BrowserRouter } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

import Layout from "./components/Layout";
import Home from "./components/Home";
import NotFound from "./components/NotFound";
import AddWorkout from "./components/AddWorkout";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import MyWorkouts from "./components/MyWorkouts";
import RequireAuth from "./guards/RequireAuth";
import RedirectIfAuth from "./guards/RedirectIfAuth";
import { ExerciseCategoryProvider } from "./context/ExerciseCatgegoryContext";
import { useAuthContext } from "./context/AuthContext";
import { IDM_API_URL, VERIFY_PATH } from "./Constants";

function App() {

  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const { logout } = useAuthContext();

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        const bodyRequest = {
          user: { id: localStorage.getItem("userId") },
          token: token
        };

        try {
          await axios.post(`${IDM_API_URL}/${VERIFY_PATH}`, bodyRequest);
          setIsAuthenticating(false);
        } catch (error) {
          console.error("Token verification failed:", error);
          await logout();
          setIsAuthenticating(false);
        }
      }
    };
    verifyToken();
  }, []);

  // const token = localStorage.getItem("token");
  // if (token && isAuthenticating) {
  //   return <div className="flex justify-center items-center h-screen w-screen bg-gray-900 text-white text-xl">Authenticating...</div>;
  // }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <RequireAuth>
            <Layout />
          </RequireAuth>
        }
        >
          <Route index path="/" element={<Home />} />
          <Route path="/add-workout" element={<AddWorkout />} />
          <Route path="/workout-statistics" element={
            <ExerciseCategoryProvider>
              <MyWorkouts />
            </ExerciseCategoryProvider>
          } />
        </Route>
        <Route path="/login" element={
          <RedirectIfAuth>
            <SignIn />
          </RedirectIfAuth>} />
        <Route path="/signup" element={
          <RedirectIfAuth>
            <SignUp />
          </RedirectIfAuth>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
