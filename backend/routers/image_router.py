from fastapi import APIRouter,UploadFile,File
from pipeline.image_pipeline import image_pipeline
router=APIRouter()

@router.post("/process-images")
async def process_images(image1:UploadFile=File(...),image2:UploadFile=File(...)):
    sampleimg=await image1.read()
    sourceimg=await image2.read()
    result=image_pipeline(sampleimg,sourceimg)
    
    return {
        "message":"Images received successfully",
        "image1":image1.filename,
        "image2":image2.filename
    }