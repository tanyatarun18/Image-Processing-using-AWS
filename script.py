from io import BytesIO
from PIL import Image
import numpy as np
import requests
import cv2


def convertToGrayAPI(img):
    API_ENDPOINT = "https://x6f9bj2yua.execute-api.ap-south-1.amazonaws.com/dev"

    # Encode image to PNG format
    is_success, im_buf_arr = cv2.imencode(".png", img)
    byte_im = im_buf_arr.tobytes()

    # Set headers
    headers = {'Content-Type': 'application/octet-stream'}

    # Send POST request
    r = requests.post(url=API_ENDPOINT, data=byte_im, headers=headers)

    # Print response code and content
    print(f"Response Code: {r.status_code}")

    # Check for successful response
    if r.status_code == 200:
        img_ = Image.open(BytesIO(r.content))
        return np.asarray(img_)
    else:
        print(f"Response Content: {r.content.decode('utf-8')}")
        raise Exception(f"Failed to convert image, server responded with: {r.text}")


def convertToGray(img):
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    return gray


if __name__ == "__main__":
    img_path = './test_img_bgr.png'

    # Read the image
    img = cv2.imread(img_path)

    print(f"Image shape: {img.shape}")
    print(f"Image type: {img.dtype}")

    # Call the API function
    img_gray = convertToGrayAPI(img)

    # Save the resulting grayscale image
    cv2.imwrite('./test_img_gray.png', img_gray)
