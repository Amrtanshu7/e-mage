import api from "./api";

export async function uploadImage(imageFile,filter) {
    const formdata = new FormData();
    formdata.append("image",imageFile);

    console.log("uploadig image:",imageFile.name);
    console.log("Filter:",filter);

    const response = await api.post(`/api/upload-to-cpp?filter=${filter}`,
        formdata,
        {
            responseType:"blob",
            headers: {
                "Content-Type": "multipart/form-data"
        }
    }
);

    return URL.createObjectURL(response.data);
}

export async function fetchImages() {
    const response = await api.get("/api/images");
    return response.data.images;
}

export async function fetchImagePreview(imageId) {
    const response = await api.get(
        `/api/images/${imageId}/preview`,
        { responseType: "blob" }
    );
    return response.data;
}