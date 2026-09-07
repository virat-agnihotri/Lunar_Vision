import cv2
import numpy as np

def apply_ransac(keypoints1,keypoints2,good_matches,image1,image2):
    #Get coordinates of matched keypoints
    sec_pts=np.float32([
        keypoints1[m.queryIdx].pt
        for m in good_matches
    ]).reshape(-1,1,2)

    dst_pts=np.float32([
        keypoints2[m.trainIdx].pt
        for m in good_matches
    ]).reshape(-1,1,2)

    #RANSAC +HOMOGRAPHY

    H,mask=cv2.findHomography(
        sec_pts,dst_pts,cv2.RANSAC,5.0
    )

    # mask tells us:
    # 1= inlier
    # 0= outlier
    
    inliers=[
        good_matches[i]
        for i in range(len(good_matches))
        if mask[i]
    ]

    outliers=[
        good_matches[i]
        for i in range(len(good_matches))
        if not mask[i]
    ]
    # Draw only RANSAC inliers
    ransac_image = cv2.drawMatches(
        image1,
        keypoints1,
        image2,
        keypoints2,
        inliers,
        None,
        flags=cv2.DrawMatchesFlags_NOT_DRAW_SINGLE_POINTS
    )

    cv2.imwrite("ransac_inliers.jpg", ransac_image)

    return H,inliers,outliers