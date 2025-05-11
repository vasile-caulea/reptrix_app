import { BrowserRouter } from "react-router-dom";

import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./components/Home";
import NotFound from "./components/NotFound";
import AddWorkout from "./components/AddWorkout";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />} >
          <Route index path="/" element={<Home />} />
          <Route path="/add-workout" element={<AddWorkout />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route path="/login" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
