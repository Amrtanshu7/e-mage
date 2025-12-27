import { useState } from "react";
import {uploadImage } from "../api/imageApi";

const UploadForm = ({ onUploadSuccess }) => {

    const [file, setFile] = useState(null);
    const [filter, setFilter] = useState("grayscale");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async(e) =>{
        e.preventDefault();
        setError("");

        if(!file) {
            return setError("Please select an image");
        }

        setLoading(true);

        try{
            const imageUrl = await uploadImage(file,filter);
            onUploadSuccess(imageUrl);
        } catch(err) {
            console.error("Upload error:", err);
            setError("Image upload failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.card}>
            <h3>
                Upload Image
            </h3>

            <form onSubmit={handleSubmit} style={styles.form}>

                <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files[0])}
                />

                <select 
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                >
                    <option value="grayscale">Grayscale</option>
                    <option value="blur">Blur</option>
                    <option value="edges">Edge detect</option>
                </select>

                {error && <p style={styles.error}>error</p>}

                <button type="submit" disabled={loading}>
                    {loading ? "Processing...": "Upload"}
                </button>
            </form>
        </div>
    );
};

const styles = {
    card: {
        border: "1px solid #ddd",
        padding: "20px",
        borderRadius: "8px",
        maxWidth: "400px"
    },
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "12px"
    },
    error: {
        color: "red"
    }
};

export default UploadForm;