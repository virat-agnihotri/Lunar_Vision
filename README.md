# 🌑 Lunar Vision

### Lunar Image Correspondence & Registration using Computer Vision

Lunar Vision is a computer-vision system designed to establish reliable correspondences between lunar surface images captured under different imaging conditions.

The project focuses on identifying common surface features, rejecting incorrect correspondences, estimating geometric transformation, and registering the images into a common reference frame.

> Originally developed around a Smart India Hackathon problem statement focused on multi-modal, illumination- and scale-invariant correspondence of lunar imagery.

---

## 🚀 Overview

Lunar surface images can vary significantly due to:

- Different illumination / sun angles
- Changes in scale
- Different viewing conditions
- Strong crater shadows
- Differences between imaging instruments

These variations make direct pixel-to-pixel comparison difficult.

Lunar Vision addresses this using a feature-based computer-vision pipeline that extracts distinctive lunar surface features, matches them between observations, removes geometrically inconsistent matches, and estimates the transformation required for image registration.

### Core Pipeline


Input Lunar Images
        │
        ▼
Image Preprocessing
(Gaussian Denoising + CLAHE)
        │
        ▼
      SIFT
 Feature Detection
        │
        ▼
   FLANN + KNN
 Feature Matching
        │
        ▼
     RANSAC
 Outlier Rejection
        │
        ▼
   Homography
Transformation Estimation
        │
        ▼
Subpixel / Local Refinement
        │
        ▼
 Image Registration
✨ Features
🔭 Lunar Image Correspondence

Compare two lunar observations and identify visually corresponding surface features.

🔍 SIFT Feature Detection

Extract scale- and rotation-invariant local features from lunar terrain.

🔗 FLANN + KNN Matching

Efficiently match feature descriptors between the reference and target images.

🛡️ RANSAC Outlier Rejection

Remove geometrically inconsistent feature correspondences and retain a consensus set of matches.

📐 Homography Estimation

Estimate the geometric transformation between corresponding image regions.

🎯 Subpixel Refinement

Refine surviving correspondences locally to improve registration quality.

🛰️ Image Registration

Transform the target observation into the reference image coordinate system.

📊 Visual Analysis

The application provides visual outputs for different stages of the pipeline, allowing the correspondence and registration process to be inspected rather than treated as a black box.

🧠 How It Works
1. Image Preprocessing

Input lunar images are first prepared for feature extraction.

The preprocessing stage includes:

Gaussian denoising
CLAHE (Contrast Limited Adaptive Histogram Equalization)

This helps improve local contrast while reducing image noise.

2. SIFT Feature Detection

SIFT (Scale-Invariant Feature Transform) is used to identify distinctive points in the lunar terrain.

Features may occur around:

Crater boundaries
Ridges
Shadow boundaries
Surface structures
Other high-contrast regions

Each detected keypoint is represented by a descriptor that can be compared with features in the second image.

3. Feature Matching

Feature descriptors are matched using:

FLANN + KNN

The matching stage produces candidate correspondences between the two observations.

Not every candidate match is geometrically correct, so further filtering is required.

4. RANSAC Filtering

RANSAC is used to identify a geometrically consistent consensus set.

Candidate Matches
       │
       ▼
     RANSAC
       │
 ┌─────┴─────┐
 ▼           ▼
Inliers    Outliers

This reduces the effect of incorrect feature correspondences before estimating the final transformation.

5. Homography Estimation

Using the geometrically consistent correspondences, the system estimates a homography describing the transformation between the two image planes.

The estimated transformation is then used to align the target observation with the reference frame.

6. Refinement

After geometric filtering, surviving correspondences can be refined locally using optical-flow-based refinement.

This provides a more precise correspondence estimate before the final registration stage.

7. Registration

The estimated transformation is applied to the target image.

The final output places the corresponding lunar terrain into a common coordinate frame.

📊 Example Results

One experimental run produced results including:

Metric	Value
RANSAC Consensus Inliers	19,246
Rejected Outliers	14,086
Inlier Consensus Ratio	57.7%
Refined Inliers	17,527
Failed Refinements	1,719
Mean LK Error	34.105 px
Maximum LK Error	163.715 px

These values are specific to the corresponding experimental image pair and should not be interpreted as universal performance guarantees.

🖥️ Application

Lunar Vision provides a web-based interface for running and inspecting the registration pipeline.

The interface is organized around:

Observation Inputs
        ↓
Processing Pipeline
        ↓
Feature Correspondence
        ↓
Geometric Filtering
        ↓
Refinement
        ↓
Registration Results

The analysis interface allows users to inspect intermediate visual results instead of only viewing the final registered image.

🛠️ Tech Stack
Frontend
React
Vite
JavaScript
HTML
CSS
Backend
Python
FastAPI
Computer Vision
OpenCV
SIFT
FLANN
KNN Matching
RANSAC
Homography
Lucas-Kanade Optical Flow
Image Processing
Gaussian Filtering
CLAHE
Feature Detection
Feature Matching
Geometric Transformation
📁 Project Structure
Lunar_Vision/
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
│
├── backend/
│   ├── main.py
│   ├── ...
│   └── requirements.txt
│
├── README.md
└── ...

The exact structure may vary depending on the current project organization.

⚙️ Local Setup
1. Clone the Repository
git clone https://github.com/virat-agnihotri/<repo-name>.git
cd <repo-name>
2. Backend Setup

Navigate to the backend:

cd backend

Create a virtual environment:

python -m venv .venv

Activate it on Windows:

.venv\Scripts\activate

Install dependencies:

pip install -r requirements.txt

Start the FastAPI server:

uvicorn main:app --reload

The backend will normally be available at:

http://127.0.0.1:8000
3. Frontend Setup

Open another terminal:

cd frontend

Install dependencies:

npm install

Start the development server:

npm run dev

The frontend will normally be available at:

http://localhost:5173
🔬 Input Data

The system is intended for lunar surface imagery where corresponding regions exist between the observations.

The project was developed around lunar datasets including imagery associated with:

Chandrayaan-2
OHRC
TMC
IIRS
Lunar Reconnaissance Orbiter (LRO)
LRO NAC

The suitability of an image pair depends on whether sufficient common visual features are available for reliable correspondence.

🎯 Project Motivation

Traditional image comparison becomes challenging when the same lunar terrain appears different because of illumination, scale, and imaging conditions.

A robust correspondence pipeline can help establish relationships between observations before further analysis such as:

Image registration
Multi-temporal comparison
Terrain analysis
Cross-instrument image comparison
Lunar mapping workflows

This project explores the computer-vision side of that problem through a complete feature-based registration pipeline.

📌 Limitations

The current implementation has several practical limitations:

Performance depends on the quality and overlap of the input images.
Highly textureless regions may provide insufficient features.
Extreme illumination differences can affect feature detection and matching.
Homography is an image-plane transformation and may not fully represent complex 3D lunar terrain geometry.
Registration quality depends on the number and spatial distribution of reliable correspondences.
Error values are dependent on the specific image pair and processing conditions.
🔮 Future Improvements

Potential improvements include:

More robust multi-scale correspondence
Improved illumination-invariant feature extraction
Multi-modal registration across different lunar sensors
More advanced geometric models
GPU acceleration for large images
Automated quality scoring for image pairs
Dense correspondence estimation
Improved subpixel refinement
Large-scale lunar image mosaicing
Integration with additional planetary datasets
📚 Key Computer Vision Concepts

This project provided practical implementation experience with:

Feature detection
Feature descriptors
Feature matching
Nearest-neighbor search
RANSAC
Homography
Image warping
Optical flow
Subpixel refinement
Image registration
Geometric verification
👨‍💻 Author

Virat Agnihotri

B.Tech CSE
ABES Institute of Technology

📄 Project Context

This project was developed as part of work around a Smart India Hackathon problem statement concerning:

Multi-modal, sun-angle and scale-invariant image correspondence using Chandrayaan-2 optical images.

The current repository focuses on the implemented computer-vision pipeline and its application interface.

⭐ If you find this project interesting

Feel free to explore the implementation, experiment with different lunar image pairs, and extend the registration pipeline for planetary imaging applications.
