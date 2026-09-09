import cv2 
import numpy as np

def subpixel_refinement(image1,image2,keypoints1,keypoints2,inliers):
    #get coordinates of ransac inliers points
    points1=np.float32([
        keypoints1[m.queryIdx].pt
        for m in inliers
    ]).reshape(-1,1,2)

    points2=np.float32([
        keypoints2[m.trainIdx].pt
        for m in inliers
    ]).reshape(-1,1,2)

    #lucas-kanade parameters
    lk_params=dict(
        winSize=(21,21),
        maxLevel=3,
        criteria=(
            cv2.TERM_CRITERIA_EPS | cv2.TERM_CRITERIA_COUNT,
            30,
            0.01
    
        )
    )
    #Refine points from image1 -> image2
    refined_points2,status,error=cv2.calcOpticalFlowPyrLK(image1,image2,points1,points2,**lk_params)
    successful=status.ravel()==1
    print("successful refinements:",np.sum(successful))
    print("failed refinements:",np.sum(~successful))

    if np.any(successful):
        print("Average lk error",
            np.mean(error[successful]))
    print("Maximum lk error:",
          np.max(error[successful]))

    return points1,refined_points2,status,error

