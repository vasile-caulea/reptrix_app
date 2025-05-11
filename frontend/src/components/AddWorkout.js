
function AddWorkout() {
    return (
        <section class="bg-gray-800 p-6 rounded-xl shadow-xl mb-8">
            <h2 class="text-xl font-bold mb-4">Adaugă un Antrenament</h2>
            <form class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input type="date" class="p-2 rounded bg-gray-700 border border-gray-600" />
                <input type="text" placeholder="Exercițiu (ex: Flotări)" class="p-2 rounded bg-gray-700 border border-gray-600" />
                <input type="number" placeholder="Repetări" class="p-2 rounded bg-gray-700 border border-gray-600" />
                <input type="number" placeholder="Seturi" class="p-2 rounded bg-gray-700 border border-gray-600" />
                <input type="number" placeholder="Greutate (kg)" class="p-2 rounded bg-gray-700 border border-gray-600" />
                <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white rounded p-2">Adaugă</button>
            </form>
        </section>
    );
}   

export default AddWorkout;