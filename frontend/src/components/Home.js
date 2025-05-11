import AddWorkout from "./AddWorkout";


function Home() {
  return (
    <>
      <h1 class="text-3xl font-semibold mb-4">Bun venit, Lica! 💪</h1>

      <AddWorkout />

      <section class="bg-gray-800 p-6 rounded-xl shadow-xl">
        <h2 class="text-xl font-bold mb-4">📈 Statistici Recente</h2>
        <p class="text-gray-400">Aici va fi un grafic cu progresul tău.</p>
      </section>
    </>
  );
}

export default Home;
