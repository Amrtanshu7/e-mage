import { useNavigate } from "react-router-dom";

const Header = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        console.log("token removed ");
        navigate("/login");
    };

    return (
        <header className="bg-slate-900 border-b border-slate-700">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                
                {/* App Name */}
                <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">
                    Emage
                </h1>

                {/* Actions */}
                <button
                    onClick={handleLogout}
                    className="
                        bg-indigo-600 hover:bg-indigo-700
                        text-white
                        px-4 py-2
                        rounded-md
                        text-sm font-medium
                        transition-colors
                    "
                >
                    Logout
                </button>
            </div>
        </header>
    );
};


export default Header;