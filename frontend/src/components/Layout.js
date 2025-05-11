import { Outlet, Link } from "react-router-dom";

function Layout() {
    return (
        <>
            <aside class="w-64 bg-gray-800 p-6 flex flex-col justify-between">
                <div>
                    <h2 class="text-2xl font-bold mb-6">Reptrix <br/>Fitness Tracker</h2>
                    <nav class="flex flex-col gap-4">
                        <Link to="/" class="hover:text-blue-400">🏠 Dashboard</Link>
                        <Link to="/add-workout" class="hover:text-blue-400">➕ Add Workout</Link>
                        <Link to="/" class="hover:text-blue-400">📊 Statistics</Link>
                    </nav>
                </div>
                <div class="mt-6">
                    <button class="text-sm hover:text-red-400">Logout</button>
                </div>
            </aside>

            <main class="flex-1 p-8 overflow-auto">
                <Outlet />
            </main>
        </>
    );
}

export default Layout;