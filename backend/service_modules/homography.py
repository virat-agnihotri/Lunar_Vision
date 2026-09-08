import cv2

def apply_homography(image,H,target_image):
    height,width=target_image.shape[:2]
    aligned_image=cv2.warpPerspective(
        image,H,(width,height)
    )
    return aligned_image