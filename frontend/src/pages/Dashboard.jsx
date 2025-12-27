import { useState } from "react";
import Header from "../components/Header";
import UploadForm from "../components/UploadForm";

const Dashboard = () => {

    const [processedImage, setProcessedImage] = useState(null);

    return (
        <>
        <Header/>
        <div style={{padding:"20px"}}>
            <h2>Dashboard</h2>
            <p>Upload and manage your images here.</p>
            <UploadForm onUploadSuccess={setProcessedImage}/>

            {processedImage && (
                <div style={{marginTop:"20px"}}>
                    <h3>Processed Image</h3>
                    <img src={processedImage} alt="Processed" style={{maxWidth:"100%"}}/>
                </div>
            )}
        </div>
        </>
    );
};

export default Dashboard;


