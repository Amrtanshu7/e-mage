export async function uploadImage(imageFile, filter){
    
    const formData = new FormData();
    formData.append("image", imageFile);

    const response = await fetch(
        `http://localhost:8080/api/upload-to-cpp?filter=${filter}`,
        {
            method: "POST",
            body: formData
        }
    );

    if (!response.ok) {
        throw new Error("Image processing failed");
    }

    const blob = await response.blob();
    return URL.createObjectURL(blob);

}