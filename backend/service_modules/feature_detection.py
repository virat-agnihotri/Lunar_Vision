import cv2
def detect_features(image1,image2):
    sift=cv2.SIFT_create()
    keypoints1,descriptors1=sift.detectAndCompute(image1,None)
    keypoints2,descriptors2=sift.detectAndCompute(image2,None)

    sift_image1 = cv2.drawKeypoints(
        image1,
        keypoints1,
        None,
        flags=cv2.DRAW_MATCHES_FLAGS_DRAW_RICH_KEYPOINTS
    )
    sift_image2 = cv2.drawKeypoints(
        image2,
        keypoints2,
        None,
        flags=cv2.DRAW_MATCHES_FLAGS_DRAW_RICH_KEYPOINTS
    )
    cv2.imwrite("sift_image1.jpg", sift_image1)
    cv2.imwrite("sift_image2.jpg", sift_image2)
    return keypoints1,descriptors1,keypoints2,descriptors2,sift_image1,sift_image2