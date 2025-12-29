import { useState } from "react";
import {useNavigate, Link } from "react-router-dom";
import api from "../api/api";

const Register = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading ,setLoading] = useState(false);

    const handleSubmit = async(e) => {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            return setError("Passwords do not match.");
        }

        setLoading(true);

        try{
            await api.post("/auth/register", {email, password});

            //redirect to login after successfull register
            navigate("/login");
        } catch (err) {
            console.error("register error:", err);
            setError(err.response?.data?.message || "Registeration failed ");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
            <div className="w-full max-w-md bg-white rounded-xl shadow-md overflow-hidden">

                {/* Brand Header */}
                <div className="bg-gradient-to-r from-slate-900 to-indigo-900 rounded-lg py-4 mb-6">
                    <h1 className="text-2xl font-bold tracking-wide text-white text-center">
                        Emage
                    </h1>
                </div>

                {/* Form */}
                <div className="p-6">
                    <h2 className="text-lg font-semibold text-slate-900 text-center">
                        Create your account
                    </h2>

                    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                        <div>
                            <label className="block text-sm text-slate-600 mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-3 py-2 border border-slate-300 rounded-md
                                           focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-slate-600 mb-1">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-3 py-2 border border-slate-300 rounded-md
                                           focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-slate-600 mb-1">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                className="w-full px-3 py-2 border border-slate-300 rounded-md
                                           focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        {error && (
                            <p className="text-sm text-red-600 text-center">
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-indigo-600 text-white py-2 rounded-md
                                       hover:bg-indigo-700 transition disabled:opacity-60"
                        >
                            {loading ? "Registering..." : "Register"}
                        </button>
                    </form>

                    <p className="text-sm text-slate-600 text-center mt-6">
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="text-indigo-600 hover:underline font-medium"
                        >
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
