import { getUserName } from "../services/Auth";
import AddWorkout from "./AddWorkout";


function Home() {

  const userName = getUserName();

  return (
    <>
      <h1 className="text-3xl font-semibold mb-4">Welcome, {userName}! &#128170;</h1>

      <AddWorkout />

      <section className="bg-gray-800 p-6 rounded-xl shadow-xl">
        <h2 className="text-xl font-bold mb-4">📈 Recent Statistics</h2>
        <p className="text-gray-400">Graphic with recent statistics.</p>
      </section>
    </>
  );
}

export default Home;
