import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/api";


const Login = () => {
    
    const navigate = useNavigate();
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [error,setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async(e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        console.log("Login submit triggered");
        console.log("Payload being sent:", {
            email,
            password
    });

        try{
            const res = await api.post("/auth/login", {email,password});
            const token = res.data.token;

            //save token
            localStorage.setItem("token", token);

            //redirect to dashboard
            navigate("/");
        } catch(err) {
            console.error("login error:", err);
            setError(err.response?.data?.message || "Login failed");
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-white border border-slate-200 rounded-xl shadow-sm p-8">
                
                {/* Brand Header */}
                <div className="bg-gradient-to-r from-slate-900 to-indigo-900 rounded-lg py-4 mb-6">
                    <h1 className="text-2xl font-bold tracking-wide text-white text-center">
                        Emage
                    </h1>
                </div>

                <p className="text-slate-600 text-center mb-6">
                    Sign in to your account
                </p>


                {/* Form */}
                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="
                                w-full rounded-md border border-slate-300
                                px-3 py-2 text-sm
                                focus:outline-none focus:ring-2 focus:ring-indigo-500
                            "
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="
                                w-full rounded-md border border-slate-300
                                px-3 py-2 text-sm
                                focus:outline-none focus:ring-2 focus:ring-indigo-500
                            "
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
                        className={`
                            w-full rounded-md py-2 text-sm font-medium transition
                            ${
                                loading
                                    ? "bg-indigo-300 cursor-not-allowed"
                                    : "bg-indigo-600 hover:bg-indigo-700 text-white"
                            }
                        `}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                {/* Footer */}
                <p className="text-sm text-slate-600 text-center mt-6">
                    Don’t have an account?{" "}
                    <Link
                        to="/register"
                        className="text-indigo-600 hover:text-indigo-700 font-medium"
                    >
                        Register
                    </Link>
                </p>
            </div>
        </main>
    );
};

export default Login;
