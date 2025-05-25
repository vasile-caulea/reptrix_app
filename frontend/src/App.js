import { BrowserRouter } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import { Toaster } from "react-hot-toast";

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
import WorkoutCalendar from "./components/WorkoutCalendar";

function App() {

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
        } catch (error) {
          console.error("Token verification failed:", error);
          alert("Your session has expired. Please log in again.");
          await logout();
        }
      }
    };
    verifyToken();
  }, []);

  return (
    <BrowserRouter>
      <Toaster position="top-right" reverseOrder={false} />
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
          <Route path="/workout-calendar" element={<WorkoutCalendar />} />
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
