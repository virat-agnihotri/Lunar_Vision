from fastapi import APIRouter,UploadFile,File
router=APIRouter()

@router.post("/process-images")
async def process_images(
    image1:UploadFile=File(...),
    image2:UploadFile=File(...)
):
    return {
        "message":"Images received successfully",
        "image1":image1.filename,
        "image2":image2.filename
    }