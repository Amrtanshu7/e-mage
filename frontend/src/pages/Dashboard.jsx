import { useEffect,useState } from "react";
import Header from "../components/Header";
import UploadForm from "../components/UploadForm";
import { fetchImages,fetchImagePreview,downloadImage,deleteImage} from "../api/imageApi";

const Dashboard = () => {

    const [processedImage, setProcessedImage] = useState(null);
    const [images, setImages] = useState([]);
    const [previewUrls, setPreviewUrls] = useState({});
    const [loading,setLoading] = useState(false);

    useEffect(() =>{
        loadImages();
    },[]);

    const loadImages = async() => {
        setLoading(true);
        try{
            const data = await fetchImages();
            console.log("fetched images:",data);
            setImages(data);
            const previews = {};

            for (const img of data) {
                try {
                    const blob = await fetchImagePreview(img._id);
                    previews[img._id] = URL.createObjectURL(blob);
                } catch (err) {
                    console.error("Preview fetch failed:", img._id, err);
                }
            }

            setPreviewUrls(previews);
        } catch(err) {
            console.error("failed to fetch Images",err);
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async (imageId) => {

        try{
            const blob = await downloadImage(imageId);
            const url = window.URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = "processed-image.jpg";
            a.click();

            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error("Download failed", err);
        }
    };

    const handleDelete = async(imageId) => {
        const confirmDelete = window.confirm("Are you want to delete this image?");

        if(!confirmDelete) return;

        try{
            await deleteImage(imageId);

            setImages((prev) => prev.filter((img) => img._id !== imageId));

            setPreviewUrls((prev) => {
                const copy = {...prev };
                delete copy[imageId];
                return copy;
            });
        } catch (err) {
            console.error("Delete failed", err);
        }
    };

    return (
        <>
        <Header/>
        <div style={{padding:"20px"}}>
            <h2 className="text-4xl font-bold text-blue-600">Dashboard</h2>
            <p>Upload and manage your images here.</p>

            <UploadForm onUploadSuccess={(imageUrl) => {
                setProcessedImage(imageUrl);
                loadImages();
            }}
            />

            {processedImage && (
                <div style={{marginTop:"20px"}}>
                    <h3>Latest Processed Image</h3>
                    <img src={processedImage} alt="Processed" style={{maxWidth:"100%"}}/>
                </div>
            )}

            <hr style ={{ margin:"30px 0" }}/>

            <h3> Your Images </h3>

            {loading && <p>Loading Images...</p>}

            {!loading && images.length === 0 && (
                <p>No images uploaded yet.</p>
            )}

            <div style = {styles.grid}>
                {images.map((img) => (
                    <div key={img._id} style = {styles.card}>
                            {previewUrls[img._id] ? (
                                <img
                                    src={previewUrls[img._id]}
                                    alt="Processed"
                                    style={styles.image}
                                />
                            ) : (
                                <p>Loading preview...</p>
                            )}
                        <p><b>Filter:</b>{img.filterType}</p>
                        <p>
                            <b>Created:</b>{" "}
                            {new Date(img.createdAt).toLocaleString()}
                        </p>
                        <div style={styles.actions}>
                            <button onClick={() => handleDownload(img._id)}>
                                Download
                            </button>
                            <button
                                onClick={() => handleDelete(img._id)}
                                style={{ color: "red" }}>
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
        </>
    );
};

const styles = {
    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
        gap: "16px",
        marginTop: "16px"
    },
    card: {
        border: "1px solid #ddd",
        padding: "10px",
        borderRadius: "6px"
    },
    image: {
    width: "100%",
    height: "150px",
    objectFit: "cover",
    borderRadius: "4px",
    marginBottom: "8px"
    },
    actions: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "8px"
    }
};

export default Dashboard;


