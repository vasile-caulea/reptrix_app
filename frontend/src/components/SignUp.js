
import { useState } from 'react';
import { SignUpService } from '../services/Auth';
import { useNavigate } from 'react-router-dom';

function SignUp() {
    const [email, setEmail] = useState('');
    const [fname, setFName] = useState('');
    const [lname, setLName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();

        if (!email || !fname || !lname || !password) {
            alert('Please fill in all fields');
            return;
        }

        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        try {
            const response = await SignUpService({ email, password, fname, lname });
            console.log('Login successful:', response);
            alert('Account created successfully! Please login.');
            navigate('/login');
        }
        catch (error) {
            console.error('SignUp failed:', error);
            alert(error.response.data.message);
        }
    };

    return (
        <div className="flex justify-center items-center h-screen w-screen bg-gray-900">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm ">
                <h2 className="text-2xl font-bold mb-4 text-center text-gray-900">Sign Up</h2>
                <form onSubmit={handleSignup}>
                    <div className="mb-4  text-gray-700">
                        <label className="block" htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-2 mt-2 border border-gray-300 rounded-md"
                            placeholder="Enter your email"
                            required
                        />
                    </div>
                    <div className="mb-4  text-gray-700">
                        <label className="block" htmlFor="email">Last Name</label>
                        <input
                            type="text"
                            id="lname"
                            name="lname"
                            value={lname}
                            onChange={(e) => setLName(e.target.value)}
                            className="w-full p-2 mt-2 border border-gray-300 rounded-md"
                            placeholder="Enter your last name"
                            required
                        />
                    </div>
                    <div className="mb-4  text-gray-700">
                        <label className="block" htmlFor="email">First Name</label>
                        <input
                            type="text"
                            id="fname"
                            name="fname"
                            value={fname}
                            onChange={(e) => setFName(e.target.value)}
                            className="w-full p-2 mt-2 border border-gray-300 rounded-md"
                            placeholder="Enter your first name"
                            required
                        />
                    </div>
                    <div className="mb-4 text-gray-700">
                        <label className="block" htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-2 mt-2 border border-gray-300 rounded-md"
                            placeholder="Enter your password"
                            required
                        />
                    </div>
                    <div className="mb-6 text-gray-700">
                        <label className="block" htmlFor="confirmPassword">Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full p-2 mt-2 border border-gray-300 rounded-md"
                            placeholder="Confirm your password"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white p-2 rounded-md"
                    >
                        Sign Up
                    </button>
                </form>
                <div className="mt-4 text-center">
                    <p className="text-gray-600">Already have an account? <a href="/login" className="text-blue-500">Login</a></p>
                </div>
            </div>
        </div>
    );
}

export default SignUp;
