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
        <div style = {styles.container}>
            <h2>Register</h2>

            <form onSubmit={handleSubmit} style={styles.form}>
                <input
                type="email"
                placeholder="E-mail"
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

                <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                style={styles.input}
                />

                {error && (<p style = {styles.error}>{error}</p>)}

                <button 
                type="submit" 
                disabled={loading} 
                style={styles.button}
                >
                    {loading ? "Registering...": "Register"}
                </button>
            </form>

            <p>Already have an account?{" "}
                <Link to="/login">Login</Link>
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


export default Register;
