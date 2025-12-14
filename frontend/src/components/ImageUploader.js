import { useState } from "react";
import { uploadImage } from "../api";

function ImageUploader() {
    const [image, setImage] = useState(null);
    const [filter, setFilter] = useState("grayscale");
    const [resultUrl, setResultUrl] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async() => {

        if(!image) return ;

        setLoading(true);
        setResultUrl(null);

        try{
            const processedImageUrl = await uploadImage(image, filter);
            setResultUrl(processedImageUrl);
        } catch (err) {
            alert("Processing failed");
        }

        setLoading(false);
    };

    return (
        <div>
            <h2> E-mage </h2>

            <input 
            type = "file"
            accept= "image/*"
            onChange={(e) => setImage(e.target.files[0])}
            />

            <select
             value={filter}
             onChange={(e) => setFilter(e.target.value)}
            >
                <option value="grayscale">Grayscale</option>
                <option value="blur">Blur</option>
                <option value="edges">Edges</option>
            </select>

            <button onClick={handleSubmit} disabled={loading}>
                {loading ? "Processing ...":"Upload & Process"}
            </button>

            {resultUrl && (
                <div>
                    <h3>Processed Image</h3>
                    <img src={resultUrl} alt="Processed result"/>
                </div>
            )}
        </div>
    );
}

export default ImageUploader;