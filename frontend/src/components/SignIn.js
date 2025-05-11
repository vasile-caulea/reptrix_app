import React, { useState } from 'react';


function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        // Aici vei face cererea de login
        console.log('Email:', email);
        console.log('Password:', password);
    };

    return (
        <div className="flex justify-center items-center h-screen w-screen bg-gray-900">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
                <h2 className="text-2xl font-bold mb-4 text-center text-gray-900">Login</h2>
                <form onSubmit={handleLogin}>
                    <div className="mb-4 text-gray-700">
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
                    <div className="mb-6 text-gray-700">
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
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white p-2 rounded-md"
                    >
                        Login
                    </button>
                </form>
                <div className="mt-4 text-center">
                    <p className="text-gray-600">Don't have an account? <a href="/signup" className="text-blue-500">Sign up</a></p>
                </div>
            </div>
        </div>
    );
}

export default SignIn;