import api from "./axios";

export const processImages =async (image1,image2)=>{
    const formData =new FormData();
    formData.append("image1",image1);
    formData.append("image2",image2);
    const response =await api.post("/process-images",formData);
    return response.data;
}