from service_modules.preProcessing import preProcessing
from service_modules.feature_detection import detect_features
from service_modules.feature_matching import match_features
from service_modules.ransac import apply_ransac
from service_modules.homography import apply_homography
from service_modules.subpixel_refinement import subpixel_refinement
import cv2
import numpy as np
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

    aligned_image=apply_homography(sampleimg,H,sourceimg)
    cv2.imwrite("aligned_image.jpg",aligned_image)
    overlay = cv2.addWeighted(
        aligned_image,
        0.5,
        sourceimg,
        0.5,
        0
    )
    cv2.imwrite("overlay.jpg", overlay)
    
    diff_image = cv2.absdiff(aligned_image, sourceimg)
    cv2.imwrite("diff_overlay.jpg", diff_image)

    points1, refined_points2, status, error = subpixel_refinement(
        sampleimg,
        sourceimg,
        keypoints1,
        keypoints2,
        inliers
    )
    print("RANSAC inliers:", len(inliers))
    print("Refined points:", len(refined_points2))
    print("Successful refinements:", np.sum(status))
    print("Total points:", len(status))

    # Helper function for base64 encoding
    import base64
    def to_b64(img):
        if img is None:
            return ""
        ret, buf = cv2.imencode('.jpg', img, [int(cv2.IMWRITE_JPEG_QUALITY), 85])
        if not ret:
            return ""
        return f"data:image/jpeg;base64,{base64.b64encode(buf).decode('utf-8')}"

    # Sample keypoints for UI SVG animation (scaled/normalized or raw)
    h1, w1 = sampleimg.shape[:2]
    sampled_kp = [
        {"x": float(kp.pt[0]), "y": float(kp.pt[1])}
        for kp in keypoints1[:600]
    ]

    # Sample matches for RANSAC line animation
    inlier_set = set(inliers)
    sampled_matches = []
    for m in good_matches[:400]:
        pt1 = keypoints1[m.queryIdx].pt
        pt2 = keypoints2[m.trainIdx].pt
        sampled_matches.append({
            "x1": float(pt1[0]),
            "y1": float(pt1[1]),
            "x2": float(pt2[0]),
            "y2": float(pt2[1]),
            "is_inlier": bool(m in inlier_set)
        })

    # Read the generated intermediate preprocessing, match, and ransac images if available
    og_img = cv2.imread("og_image1.png")
    gauss_img = cv2.imread("gaussianBlur1.png")
    clahe_img = cv2.imread("clahe1.png")
    match_img = cv2.imread("flann_matches.png")
    ransac_img = cv2.imread("ransac_inliers.jpg")

    successful = status.ravel() == 1
    avg_err_val = float(np.mean(error[successful])) if np.any(successful) else 0.0
    max_err_val = float(np.max(error[successful])) if np.any(successful) else 0.0

    return {
        "status": "VERIFIED",
        "message": "Scientific registration pipeline completed successfully.",
        "sample_image": to_b64(sampleimg),
        "reference_image": to_b64(sourceimg),
        "original_sample": to_b64(og_img) if og_img is not None else to_b64(sampleimg),
        "gaussian_sample": to_b64(gauss_img) if gauss_img is not None else to_b64(sampleimg),
        "clahe_sample": to_b64(clahe_img) if clahe_img is not None else to_b64(sampleimg),
        "sift_viz": to_b64(sift_image1),
        "matches_viz": to_b64(match_img) if match_img is not None else to_b64(sift_image1),
        "ransac_viz": to_b64(ransac_img) if ransac_img is not None else to_b64(sift_image1),
        "warped_image": to_b64(aligned_image),
        "overlay_image": to_b64(overlay),
        "diff_image": to_b64(diff_image),
        "keypoints": sampled_kp,
        "matches": sampled_matches,
        "metrics": {
            "keypoints": len(keypoints1) + len(keypoints2),
            "keypoints_image1": len(keypoints1),
            "keypoints_image2": len(keypoints2),
            "good_matches": len(good_matches),
            "inliers": len(inliers),
            "outliers": len(outliers),
            "inlier_ratio": f"{(len(inliers) / max(len(good_matches), 1) * 100):.1f}%",
            "avg_error": f"{avg_err_val:.3f} px",
            "max_error": f"{max_err_val:.3f} px",
            "successful_refinements": int(np.sum(status == 1)),
            "failed_refinements": int(np.sum(status == 0)),
            "total_points": int(len(status)),
            "homography": H.tolist() if H is not None else []
        }
    }
