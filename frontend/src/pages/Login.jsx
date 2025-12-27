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
    <div style = {styles.container}>
        <h2>Login</h2>

        <form onSubmit={handleSubmit} style={styles.form}>
            <input
            type="email"
            placeholq="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
            />
            <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
            />
            {error && (<p style={styles.error}>{error}</p>)}

            <button 
            type="submit"
            disabled={loading}
            style={styles.button}
            >
                {loading ? "Logging in ....": "Login"}
            </button>
        </form>
        <p>
            Don't have an account?{""}
            <Link to="/register">Register</Link>
        </p>
    </div>
    );
};

const styles = {
    container: {
        maxWidth: "400px",
        margin: "100px auto",
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "8px",
        textAlign: "center"
    },
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "12px"
    },
    input: {
        padding: "10px",
        fontSize: "16px"
    },
    button: {
        padding: "10px",
        fontSize: "16px",
        cursor: "pointer"
    },
    error: {
        color: "red"
    }
};

export default Login;
