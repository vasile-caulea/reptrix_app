import { use, useEffect, useState } from "react";

import AddWorkout from "./AddWorkout";
import WorkoutStatistics from "./WorkoutsStatistics";
import { getUserName } from "../services/Auth";
import { getAllWorkouts } from "../services/WorkoutManangement";
import { getWeekStartAndEnd } from "../services/Utils";
import { useAuthContext } from "../context/AuthContext";

function Home() {

  const userName = getUserName();
  const { logout } = useAuthContext();
  const [weeklyWorkouts, setWeeklyWorkouts] = useState([]);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    async function fetchWeeklyWorkouts() {
      const params = getWeekStartAndEnd();
      setIsFetching(true);
      try {
        const allData = await getAllWorkouts(params);
        setWeeklyWorkouts(allData.data);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          alert("You must be logged in to view your workouts.");
          await logout();
        }
      }
      setIsFetching(false);
    }

    fetchWeeklyWorkouts();
  }, []);

  return (
    <>
      <h1 className="text-3xl font-semibold mb-4">Welcome, {userName}! &#128170;</h1>

      <AddWorkout />

      <section className="bg-gray-800 p-6 rounded-xl shadow-xl">
        <h2 className="text-xl font-bold mb-4">&#128200; Recent Statistics</h2>
        {
          isFetching ? (
            <p className="text-gray-400 mt-4">Loading weekly workout statistics...</p>
          ) :
            weeklyWorkouts.length === 0 ? (
              <p className="text-gray-400 mt-4">No workouts recorded yet. Start adding your workouts!</p>
            ) :
              <>
                <p className="text-gray-400 mt-4 mb-4">Here are your weekly workout statistics</p>
                <WorkoutStatistics workouts={weeklyWorkouts} displayTitle={false} />
              </>
        }
      </section>
    </>
  );
}

export default Home;
