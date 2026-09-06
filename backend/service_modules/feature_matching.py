import cv2

def match_features(descriptors1,descriptors2,image1,image2,keypoints1,keypoints2):
    # FLANN parameters for SIFT
    index_params=dict(algorithm=1,trees=5)
    search_params=dict(checks=50)
    flann=cv2.FlannBasedMatcher(index_params,search_params)

    # KNN matching
    matches=flann.knnMatch(descriptors1,descriptors2,k=2)

    # lowe's ratio test
    good_matches=[]
    for m,n in matches:
        if m.distance <0.7 *n.distance:
            good_matches.append(m)

    # draw matches for debugging
    match_image=cv2.drawMatches(image1,keypoints1,image2,keypoints2,good_matches,None,
                                flags=cv2.DrawMatchesFlags_NOT_DRAW_SINGLE_POINTS)
    cv2.imwrite("flann_matches.png",match_image)

    return good_matches