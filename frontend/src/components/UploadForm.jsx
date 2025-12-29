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
        <div className="w-full max-w-md mx-auto bg-white border border-slate-200 rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
                Upload Image
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* File Input */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                        Image file
                    </label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setFile(e.target.files[0])}
                        className="block w-full text-sm text-slate-600
                                   file:mr-4 file:py-2 file:px-4
                                   file:rounded-md file:border-0
                                   file:text-sm file:font-medium
                                   file:bg-slate-100 file:text-slate-700
                                   hover:file:bg-slate-200"
                    />
                </div>

                {/* Filter */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                        Filter type
                    </label>
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm
                                   focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="grayscale">Grayscale</option>
                        <option value="blur">Blur</option>
                        <option value="edges">Edge detect</option>
                    </select>
                </div>

                {/* Error */}
                {error && (
                    <p className="text-sm text-red-600">{error}</p>
                )}

                {/* Submit */}
                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full rounded-md py-2 text-sm font-medium transition
                        ${
                            loading
                                ? "bg-indigo-300 cursor-not-allowed"
                                : "bg-indigo-600 hover:bg-indigo-700 text-white"
                        }`}
                >
                    {loading ? "Processing..." : "Upload"}
                </button>
            </form>
        </div>
    );
};


export default UploadForm;