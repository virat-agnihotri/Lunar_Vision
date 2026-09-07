from service_modules.preProcessing import preProcessing
from service_modules.feature_detection import detect_features
from service_modules.feature_matching import match_features
from service_modules.ransac import apply_ransac


def image_pipeline(smapleimg_bytes,sourceimg_bytes):
    print("working...")
    # preprocessing
    sampleimg,sourceimg=preProcessing(smapleimg_bytes,sourceimg_bytes)

    # SIFT feature detection
    keypoints1,descriptors1,keypoints2,descriptors2,sift_image1,sift_image2=detect_features(sampleimg,sourceimg)

    print("image 1 keypoints:",len(keypoints1))
    print("image 2 keypoints:",len(keypoints2))

    # FLANN + KNN + Ratio Test
    good_matches=match_features(descriptors1,descriptors2,sampleimg,sourceimg,keypoints1,keypoints2)
    print("Good matches:", len(good_matches))

    H, inliers, outliers = apply_ransac( keypoints1,keypoints2,good_matches,sampleimg,sourceimg)

    print("Good matches:", len(good_matches))
    print("RANSAC inliers:", len(inliers))
    print("RANSAC outliers:", len(outliers))

    return{
        "message": "SIFT + FLANN completed",
        "keypoints_image1": len(keypoints1),
        "keypoints_image2": len(keypoints2),
        "good_matches": len(good_matches)
    }
