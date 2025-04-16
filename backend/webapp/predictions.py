
import cv2
from skimage.feature import graycomatrix, graycoprops
from skimage import io, color, filters, measure, morphology, feature
import os
from scipy.stats import skew, kurtosis
import numpy as np
import requests
from urllib.parse import urlparse 

def read_image_from_url(url):
    # Validate URL
    if not urlparse(url).scheme in ("http", "https"):
        raise ValueError("Invalid URL. Must start with 'http://' or 'https://'.")

    # Download the image
    response = requests.get(url, stream=True)
    response.raise_for_status()  # Check for HTTP errors

    # Convert to OpenCV format
    image_data = np.asarray(bytearray(response.raw.read()), dtype=np.uint8)
    image = cv2.imdecode(image_data, cv2.IMREAD_COLOR)  # Read as BGR format

    return image

def predict_leaf(imagepath, selectedfeature):
    leaf_type = run_prediction_algorithm(imagepath, selectedfeature)
    return (f"{leaf_type}")

def run_prediction_algorithm(imagepath, feature_type):
    image = read_image_from_url(imagepath)
    if image is None:
        return "Error: Unable to load image."

    if feature_type == "color":
        lab = cv2.cvtColor(image, cv2.COLOR_BGR2LAB)
        a_mean = np.mean(lab[:, :, 1])
        b_std = np.std(lab[:, :, 2])
        return classify_by_color(a_mean, b_std)
        
    elif feature_type == "texture":
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        mean = np.mean(gray)
        variance = np.var(gray)
        entropy = -np.sum(gray * np.log2(gray + 1e-5))  # Add epsilon to avoid log(0)
        skewness = skew(gray.flatten())
        kurt = kurtosis(gray.flatten())
        glcm = graycomatrix(gray, distances=[5], angles=[0], levels=256, symmetric=True, normed=True)
        contrast = graycoprops(glcm, 'contrast')[0, 0]
        energy = graycoprops(glcm, 'energy')[0, 0]
        homogeneity = graycoprops(glcm, 'homogeneity')[0, 0]
        correlation = graycoprops(glcm, 'correlation')[0, 0]

        texture_features= {
            "Mean": mean,
            "Variance": variance,
            "Entropy": entropy,
            "Skewness": skewness,
            "Kurtosis": kurt,
            "Contrast": contrast
        }
        return classify_by_texture( texture_features)
        
    elif feature_type == "shpae":
        def crop_and_pad_image(image, margin=15):
            h, w = image.shape[:2]

            # Ensure we don't crop too much
            if h <= 2*margin or w <= 2*margin:
                return image

            # Crop margins
            cropped = image[margin:h-margin, margin:w-margin]

            # Pad with white pixels to original size
            padded = cv2.copyMakeBorder(
                cropped,
                top=margin,
                bottom=margin,
                left=margin,
                right=margin,
                borderType=cv2.BORDER_CONSTANT,
                value=[255, 255, 255]  # White padding
            )

            return padded

        processed = crop_and_pad_image(image, margin=20)
        gray = color.rgb2gray(processed)
        blurred = filters.gaussian(gray, sigma=1)
        threshold_value = filters.threshold_otsu(blurred)
        binary = blurred > threshold_value
        edges = feature.canny(binary, sigma=1)
        labeled_image = morphology.label(binary)
        contours = measure.find_contours(binary, level=0.8)
        if len(contours) == 0:
            return None, None, None

        contour = max(contours, key=len)
        contour_image = np.zeros(binary.shape, dtype=bool)
        contour = np.round(contour).astype(int)
        contour_image[contour[:, 0], contour[:, 1]] = 1
        area = np.sum(contour_image)
        
        perimeter = measure.perimeter(contour_image)
        min_row, min_col = np.min(contour, axis=0)
        max_row, max_col = np.max(contour, axis=0)
        w = max_col - min_col
        h = max_row - min_row
        aspect_ratio = w / h
        rect_area = w * h
        extent = area / rect_area if rect_area > 0 else 0
        hull = morphology.convex_hull_image(contour_image)
        hull_area = np.sum(hull)
        solidity = area / hull_area if hull_area > 0 else 0

        regions = measure.regionprops(labeled_image)
        if len(regions) == 0:
            return None
        centroid_y, centroid_x = regions[0].centroid

        features={
            "Area": area,
            "Perimeter": perimeter,
            "Aspect Ratio": aspect_ratio,
            "Extent": extent,
            "Solidity": solidity,
            "Centroid X": centroid_x,
            "Centroid Y": centroid_y
        }

        return classify_by_shape(features)

def classify_by_color(a_mean, b_std):
    """Classification using LAB color features"""
    if a_mean>=127.7:
        M='Cordyline_fruticosa'
    elif 127.0<a_mean<127.7:
        if 127.1<a_mean<127.4:
            M='Cleistocalyx_operculatus'
        else:
            M='Bougainvillea'
    elif 126.0<a_mean<127.0:
        if 7.0<b_std<=10.5:
            M='Psidium_gauvaja'
        else:
            M='Psuderanthemum_carruthersii'
    else:
        M = "unclear"

    return M

def classify_by_texture(texture_features):
    
    species_thresholds = {
    "Bougainvillea": {
        "Variance": ((0.0074, 0.0107), 2),
        "Entropy": ((33000, 48000), 1.5),
        "Skewness": ((-7.7, -6.4), 1.5),
        "Kurtosis": ((39, 58), 1)
    },
    "Cleistocalyx_operculatus": {
        "Variance": ((0.0141, 0.0187), 2),
        "Entropy": ((61000, 83000), 1.5),
        "Skewness": ((-5.7, -5.0), 1.5),
        "Kurtosis": ((23.9, 30.2), 1)
    },
    "Cordyline_fruticosa": {
        "Variance": ((0.0391, 0.0819), 2),
        "Entropy": ((360000, 505000), 1.5),
        "Skewness": ((-2.1, -1.4), 1.5),
        "Kurtosis": ((0.5, 2.4), 1)
    },
    "Psidium_gauvaja": {
        "Variance": ((0.0208, 0.0271), 3),  # ↑ Increased weight
        "Entropy": ((131000, 166000), 1),
        "Skewness": ((-3.8, -3.2), 1),
        "Kurtosis": ((8.7, 12.6), 1),
            "Contrast":((12.369182,15.806119),2)
    },
    "Psuderanthemum_carruthersii": {
        "Variance": ((0.0157, 0.0339), 2),
        "Entropy": ((129000, 199000), 1),
        "Skewness": ((-3.9, -3.2), 1),
        "Kurtosis": ((8.7, 13.6), 1),
        "Contrast":((16.5012502,21.543775 ),2)
    }
    }
    


    # Initialize scores for each species
    scores = {species: 0 for species in species_thresholds}
            # Assign points based on feature thresholds
    for species, feature_data in species_thresholds.items():
        for feature_name, (range_vals, weight) in feature_data.items():
            value = texture_features.get(feature_name, None)
            if value is not None and range_vals[0] <= value <= range_vals[1]:
                scores[species] += weight
            

    # Determine the species with the highest score
    predicted_species = max(scores, key=scores.get)

    return predicted_species


def classify_by_shape(features):
        # Define thresholds for each species based on your analysis
        species_thresholds = {
        "Bougainvillea": {
        "Area": (800, 1150),  # Original: 894-1056 (+15% buffer)
        "Aspect Ratio": (1.5, 1.8),  # Original: 1.56-1.70
        "Solidity": (0.011, 0.014),  # Original: 0.0116-0.0136
        "Extent": (0.0075, 0.010)
        },
        "Cleistocalyx_operculatus": {  # Unified naming
        "Area": (1300, 1600),  # Original: 1388-1516
            "Aspect Ratio": (2.4, 2.8),  # Original: 2.46-2.73
            "Solidity": (0.0105, 0.0125),  # Original: 0.0109-0.0121
        "Extent": (0.007, 0.0085)
        },
        "Cordyline_fruticosa": {
        "Area": (4000, 6500),  # Original: 4183-6268
        "Aspect Ratio": (4.0, 5.2),  # Original: 4.11-5.08
        "Solidity": (0.006, 0.009),  # Original: 0.0064-0.0087
        "Extent": (0.004, 0.0065)
            },
        "Psidium_gauvaja": {  # Use underscore for consistency
        "Area": (1700, 2300),        # Observed: 1797-2183 (+5% buffer)
            "Aspect Ratio": (2.0, 3.0),  # Observed: 2.06-2.84 (+8% buffer)
        "Solidity": (0.007, 0.0085), # Observed: 0.0072-0.00809
        "Extent": (0.0048, 0.0056)   # Observed: 0.0050-0.0054
        },

        "Psuderanthemum_carruthersii": {
            "Area": (1500, 1900),  # Original: 1575-1811
            "Aspect Ratio": (1.4, 1.9),  # Original: 1.49-1.78
            "Solidity": (0.006, 0.0075),  # Original: 0.0062-0.00725
        "Extent": (0.004, 0.0055)
        }
        }


        # Initialize scores for each species
        scores = {species: 0 for species in species_thresholds}
            # Assign points based on feature thresholds
        for species, thresholds in species_thresholds.items():
            for feature_name, range_values in thresholds.items():
                if range_values[0] <= features[feature_name] <= range_values[1]:
                    scores[species] += 1

        # Determine the species with the highest score
        predicted_species = max(scores, key=scores.get)

        return predicted_species

def run_feature_extractor(imagepath, feature_type):
    image = read_image_from_url(imagepath)
    if image is None:
        return "Error: Unable to load image."

    if feature_type == "color":
        lab = cv2.cvtColor(image, cv2.COLOR_BGR2LAB)
        a_mean = np.mean(lab[:, :, 1])
        b_std = np.std(lab[:, :, 2])
        return {"Green-red Channel Mean": a_mean, "Blue-Red Channel Standard Deviation": b_std}
        
    elif feature_type == "texture":
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        mean = np.mean(gray)
        variance = np.var(gray)
        entropy = -np.sum(gray * np.log2(gray + 1e-5))  # Add epsilon to avoid log(0)
        skewness = skew(gray.flatten())
        kurt = kurtosis(gray.flatten())
        glcm = graycomatrix(gray, distances=[5], angles=[0], levels=256, symmetric=True, normed=True)
        contrast = graycoprops(glcm, 'contrast')[0, 0]
        energy = graycoprops(glcm, 'energy')[0, 0]
        homogeneity = graycoprops(glcm, 'homogeneity')[0, 0]
        correlation = graycoprops(glcm, 'correlation')[0, 0]

        texture_features= {
            "Mean": mean,
            "Variance": variance,
            "Entropy": entropy,
            "Skewness": skewness,
            "Kurtosis": kurt,
            "Contrast": contrast
        }
        return texture_features
        
    elif feature_type == "shpae":
        def crop_and_pad_image(image, margin=15):
            h, w = image.shape[:2]

            # Ensure we don't crop too much
            if h <= 2*margin or w <= 2*margin:
                return image

            # Crop margins
            cropped = image[margin:h-margin, margin:w-margin]

            # Pad with white pixels to original size
            padded = cv2.copyMakeBorder(
                cropped,
                top=margin,
                bottom=margin,
                left=margin,
                right=margin,
                borderType=cv2.BORDER_CONSTANT,
                value=[255, 255, 255]  # White padding
            )

            return padded

        processed = crop_and_pad_image(image, margin=20)
        gray = color.rgb2gray(processed)
        blurred = filters.gaussian(gray, sigma=1)
        threshold_value = filters.threshold_otsu(blurred)
        binary = blurred > threshold_value
        edges = feature.canny(binary, sigma=1)
        labeled_image = morphology.label(binary)
        contours = measure.find_contours(binary, level=0.8)
        if len(contours) == 0:
            return None, None, None

        contour = max(contours, key=len)
        contour_image = np.zeros(binary.shape, dtype=bool)
        contour = np.round(contour).astype(int)
        contour_image[contour[:, 0], contour[:, 1]] = 1
        area = np.sum(contour_image)
        
        perimeter = measure.perimeter(contour_image)
        min_row, min_col = np.min(contour, axis=0)
        max_row, max_col = np.max(contour, axis=0)
        w = max_col - min_col
        h = max_row - min_row
        aspect_ratio = w / h
        rect_area = w * h
        extent = area / rect_area if rect_area > 0 else 0
        hull = morphology.convex_hull_image(contour_image)
        hull_area = np.sum(hull)
        solidity = area / hull_area if hull_area > 0 else 0

        regions = measure.regionprops(labeled_image)
        if len(regions) == 0:
            return None
        centroid_y, centroid_x = regions[0].centroid

        features={
            "Area": area,
            "Perimeter": perimeter,
            "Aspect Ratio": aspect_ratio,
            "Extent": extent,
            "Solidity": solidity,
            "Centroid X": centroid_x,
            "Centroid Y": centroid_y
        }

        return features
    