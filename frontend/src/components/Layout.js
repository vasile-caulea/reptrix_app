import { Outlet, Link } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Layout() {
    const { logout } = useAuthContext();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
        alert('Logout successful!');
    }

    const hoverStyleClass = "hover:text-blue-400";
    return (
        <>
            <aside className="w-64 bg-gray-800 p-6 flex flex-col justify-between">
                <div>
                    <h2 className="text-2xl font-bold mb-6">Reptrix <br />Fitness Tracker</h2>
                    <nav className="flex flex-col gap-4">
                        <Link to="/" className={hoverStyleClass}>&#127968; Dashboard</Link>
                        <Link to="/add-workout" className={hoverStyleClass}>&#10133; Add Workout</Link>
                        <Link to="/workout-calendar" className={hoverStyleClass}>&#128197; Calendar</Link>
                        <Link to="/workout-statistics" className={hoverStyleClass}>&#128202; Statistics</Link>
                        <Link to="/profile" className={hoverStyleClass}>&#128100; Profile</Link>
                        <Link to="/exercises" className={hoverStyleClass}>&#128170; Exercises</Link>
                    </nav>
                </div>
                <div className="mt-6">
                    <button className="text-sm hover:text-red-400" onClick={handleLogout}>Logout</button>
                </div>
            </aside>

            <main className="flex-1 p-8 overflow-auto">
                <Outlet />
            </main>
        </>
    );
}

export default Layout;