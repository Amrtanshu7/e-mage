import { useEffect,useState } from "react";
import Header from "../components/Header";
import UploadForm from "../components/UploadForm";
import { fetchImages,fetchImagePreview,downloadImage,deleteImage} from "../api/imageApi";
import toast from "react-hot-toast";

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
            toast.success("Download started");
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
            toast.success("Image deleted");
            setImages((prev) => prev.filter((img) => img._id !== imageId));

            setPreviewUrls((prev) => {
                const copy = {...prev };
                delete copy[imageId];
                return copy;
            });
        } catch (err) {
            console.error("Delete failed", err);
            toast.error("Failed to delete image");
        }
    };

    return (
    <>
        <Header />

        <main className="min-h-screen bg-slate-100">
            <div className="max-w-7xl mx-auto px-6 py-8">

                {/* Page Title */}
                <div className="text-center">
                    <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
                        Dashboard
                    </h2>
                    <p className="text-slate-600 mt-1">
                        Upload and manage your images here.
                    </p>
                </div>

                {/* Upload Section (CENTERED) */}
                <div className="mt-8 flex justify-center">
                    <div className="w-full max-w-md">
                        <UploadForm
                            onUploadSuccess={(imageUrl) => {
                                setProcessedImage(imageUrl);
                                loadImages();
                            }}
                        />
                    </div>
                </div>

                {/* Latest Image */}
                {processedImage && (
                    <div className="mt-10">
                        <h3 className="text-lg font-medium text-slate-900 mb-3">
                            Latest Processed Image
                        </h3>
                        <img
                            src={processedImage}
                            alt="Processed"
                            className="max-w-full rounded-lg border border-slate-300"
                        />
                    </div>
                )}

                <hr className="my-10 border-slate-300" />

                {/* Images Section */}
                <h3 className="text-lg font-medium text-slate-900">
                    Your Images
                </h3>

                {loading && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div
                                key={i}
                                className="bg-white border border-slate-200 rounded-xl p-3 animate-pulse"
                            >
                                <div className="h-40 bg-slate-200 rounded-md mb-3" />
                                <div className="h-4 bg-slate-200 rounded w-3/4 mb-2" />
                                <div className="h-3 bg-slate-200 rounded w-1/2" />
                            </div>
                        ))}
                    </div>
                )}

                {!loading && images.length === 0 && (
                    <div className="mt-10 flex flex-col items-center text-center bg-white border border-slate-200 rounded-xl p-8">
                        <div className="text-4xl mb-4">🖼️</div>
                        <h4 className="text-lg font-semibold text-slate-900">
                            No images yet
                        </h4>
                        <p className="text-slate-600 mt-2 max-w-sm">
                            Upload your first image to see it processed and listed here.
                        </p>
                    </div>
                )}


                {/* Image Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
                    {images.map((img) => (
                    <div
                    key={img._id}
                    className="
                        group bg-white border border-slate-200 rounded-xl
                        shadow-sm hover:shadow-md
                        transition-all duration-200
                        overflow-hidden
                    "
                    >
                    {/* Image */}
                    {previewUrls[img._id] ? (
                        <div className="relative">
                            <img
                                src={previewUrls[img._id]}
                                alt="Processed"
                                className="w-full h-40 object-cover"
                            />

                            {/* Hover Overlay */}
                            <div className="
                                absolute inset-0 bg-black/40
                                opacity-0 group-hover:opacity-100
                                transition-opacity
                                flex items-center justify-center gap-4
                            ">
                                <button
                                    onClick={() => handleDownload(img._id)}
                                    className="bg-white text-slate-900 text-sm font-medium px-3 py-1.5 rounded-md hover:bg-slate-100"
                                >
                                    Download
                                </button>

                                <button
                                    onClick={() => handleDelete(img._id)}
                                    className="bg-red-600 text-white text-sm font-medium px-3 py-1.5 rounded-md hover:bg-red-700"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                        ) : (
                        <div className="h-40 flex items-center justify-center text-sm text-slate-500">
                            Loading preview...
                        </div>
                    )}

                    {/* Metadata */}
                    <div className="p-3">
                        <p className="text-sm text-slate-700">
                            <span className="font-medium">Filter:</span> {img.filterType}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                            {new Date(img.createdAt).toLocaleString()}
                        </p>
                    </div>
                </div>

                    ))}
                </div>
            </div>
        </main>
    </>
);

};

export default Dashboard;


