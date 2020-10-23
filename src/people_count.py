from imutils.object_detection import non_max_supression
from base64 import b64encode
import numpy as np
import imutils
import cv2
import requests
import time
import argparse

# API Key:
# BBFF-8ac0db61959c70359eea7879119dccc2e01

# Token:
# BBFF-Ugasz1Zb8ov9VlUTuYQMmZKoNQIdW7

URL_EDU = "http://things.ubidots.com"
INDUSTRIAL_USER = False
token = "BBFF-Ugasz1Zb8ov9VlUTuYQMmZKoNQIdW7"
device = "detector"
variable = "people"

# HOG = Histogram of oriented gradients
hogcv = cv2.HOGDescriptor()
hogcv.setSVMDetector(cv2.HOGDescriptor_getDefaultPeopleDetector())

def detector(image):
    '''
    Basically detects people and marks
    them with funny boxes...
    image is a numpy array
    '''
    image = imutils.resize(image, width=min(400, image.shape[1]))
    clone = image.copy()

    # Detect multiscale detects people... basically
    (rects, weights) = hogcv.detectMultiScale(image, winStride=(8,8), padding=(32,32), scale=1.05)

    # supress overlapping boxes
    rects = np.array([[x, y, x+w, y+h] for (x, y, w, h) in rects])
    result = non_max_supression(rects, probs=None, overlapThresh=0.65)

    return result

def local_detect(image_path):
    '''
    It takes a local image path as
    an argument an returns the same
    image but with people marked 
    inside funny boxes.
    '''

    result = []
    image = cv2.imread(image_path)
    if len(image) <= 0:
        print("[ERROR] could not read your local image")
        return result

    print("[INFO] Detecting people")
    result = detector(image)

    # Show the results (boxes around people)
    for (xA, yA, xB, yB) in result:
        cv2.rectangle(image, (xA, yA), (xB, yB), (0, 255, 55))

    cv2.imshow("result", image)
    cv2.waitKey(0)
    cv2.destroyAllWindows()

    return (result, image)

def camera_detect(token, device, variable, sample_time=5):
    '''
    This function is pretty self explanatory. We capture
    each frame with the camera, we detect wheter or not
    there are people in frame. Additionally we send every
    frame to ubidots.
    '''
    cap =cv2.VideoCapture(0)
    init = time.time()

    if sample_time < 1:
        sample_time = 1

    while(True):
        # This basically captures frame by frame
        ret, frame = cap.read()
        frame = imutils.resize(frame, width=min(400, frame.shape[1]))
        result = detector(frame.copy())

        # This shows the result
        for (xA, yA, xB, yB) in result:
            cv2.rectangle(frame, (xA, yA), (xB, yB), (0, 255, 55))
        cv2.imshow('frame', frame)

        # Send them results
        if time.time( - init >= sample_time):
            print("[INFO] Sending frame results")
            # We have to convert image to base64
            b64_img = convert_to_base64(frame)
            context = {"image": b64_img}
            send_to_ubidots(token, device, variable, len(result, context=context))
            init = time.time()

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()

def convert_to_base64(image):
    '''
    Helper function to convert images to base64
    to send them across the web.
    '''
    image = imutils.resize(image, width=400)
    img_str = cv2.imencode('.png', image)[1].tostring()
    b64 = b64encode(img_str)
    return b64.decode('utf-8')

def detect_people(args):
    '''
    Main function. Not much else to say.
    '''
    image_path = args["image"]
    camera = True if str(args["camera"]) == 'true' else False

    if image_path != None and not camera:
        print("[INFO] Image path provided, attempting to read image")
        (result, image) = local_detect(image_path)
        print("[INFO] Sending results")
        b64 = convert_to_base64(image)
        context = {"image": b64}

        # Send the image result
        req = send_to_ubidots(token, device, variable, len(result), context=context)
        if req.status_code >= 400:
            print("[ERROR] Could not send data to the server")
            return req
        
        if camera: 
            print("[INFO] Reading camera images")
            camera_detect(token, device, variable)

def build_payload(variable, value, context):
    '''
    This helper function build the payload to be sent
    to the server.
    '''
    return {variable: {"value": value, "Content-Type": "application/json"}}

def send_to_ubidots(token, device, variable, value, context={}, industrial=False):
    '''
    This helper functions sends the payload to the server.
    '''
    # Builds the endpoint
    url = URL_EDU
    url = "{}/api/v1.6/devices/{}".format(url, device)

    payload = build_payload(variable, value, context)
    headers = {"X-Auth-Token": token, "Content-Type": "application/json"}

    attempts = 0
    status = 400

    while status >= 400 and attempts <= 5:
        req = requests.post(url=url, headers=headers, json=payload)
        status =req.status_code
        attempts += 1
        time.sleep(1)

    return req

def argsParser():
    '''
    This little function is really useful and may see more 
    implementations in the future.
    '''
    ap = argparse.ArgumentParser()
    ap.add_argument("-i", "--image", default=None,
        help="path to image test file directory")
    ap.add_argument("-c", "--camera", default=False,
        help="Set as true if you wish to use the camera")
    args = vars(ap.parse_args())

    return args

if __name__ == "__main__":
    args = argsParser()
    detect_people()