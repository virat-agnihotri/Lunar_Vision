import numpy as np
import cv2

def preProcessing(image1_bytes,image2_bytes):
    image1=cv2.imdecode(
        np.frombuffer(image1_bytes,np.uint8),
        cv2.IMREAD_GRAYSCALE
        
    )
    cv2.imwrite("original.png", image1)
    image2=cv2.imdecode(
        np.frombuffer(image1_bytes,np.uint8),
        cv2.IMREAD_GRAYSCALE
    )
    # gausion denoising
    image1=cv2.GaussianBlur(image1,(5,5),0)
    image2=cv2.GaussianBlur(image1,(5,5),0)
    cv2.imwrite("gaussianBlur1.png",image1)

    # CLAHE
    clahe=cv2.createCLAHE(
        clipLimit=2.0,
        tileGridSize=(8,8)
    )
    image1=clahe.apply(image1)
    image2=clahe.apply(image2)
    cv2.imwrite("clahe1.png",image1)
    return image1,image2