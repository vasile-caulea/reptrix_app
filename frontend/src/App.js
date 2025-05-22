import { BrowserRouter } from "react-router-dom";
import { Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import Home from "./components/Home";
import NotFound from "./components/NotFound";
import AddWorkout from "./components/AddWorkout";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import MyWorkouts from "./components/MyWorkouts";
import RequireAuth from "./guards/RequireAuth";
import RedirectIfAuth from "./guards/RedirectIfAuth";

function App() {
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
          <Route path="/workout-statistics" element={<MyWorkouts />} />
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
