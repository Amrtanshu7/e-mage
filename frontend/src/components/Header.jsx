import { useNavigate } from "react-router-dom";

const Header = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        console.log("token removed ");
        navigate("/login");
    };

    return (
        <div style = {styles.header}>
            <h3>E-mage</h3>
            <button onClick={handleLogout} style={styles.button}>
                Logout
            </button>
        </div>
    );
};

const styles = {
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "12px 20px",
        borderBottom: "1px solid #ddd"
    },
    button: {
        padding: "6px 12px",
        cursor: "pointer"
    }
};

export default Header;