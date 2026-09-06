export const processImages =async (image1,image2)=>{
    const formData =new formData();
    formData.append(image1);
    formData.append(image2);
    const response =await api.post("/process-images",formData);
    return response.data;
}