from imutils.object_detection import non_max_suppression
import numpy as np
import imutils
import cv2
import requests
import time
import argparse
import time
import base64
# Our module to make requests to the server
import auth 

'''
Usage:
python src/main.py -i PATH_TO_IMAGE     # Reads and detect people in a single local stored image
python src/main.py -c                   # Attempts to detect people using webcam
'''

# ANSI COLORS:
RED = "\033[0;31m"
GREEN = "\033[0;32m"
CYAN = "\033[0;36m"
LIGHT_GRAY = "\033[0;37m"

# Pin already stored in the database pertaining to the Alsuper Robinson store
STORE_PIN = "5431"

# Opencv pre-trained SVM with HOG people features 
HOGCV = cv2.HOGDescriptor()
HOGCV.setSVMDetector(cv2.HOGDescriptor_getDefaultPeopleDetector())

def detector(image):
    '''
    Basically detects people and marks
    them with funny boxes...
    image is a numpy array
    '''

    clone = image.copy()

    (rects, weights) = HOGCV.detectMultiScale(image, winStride=(4, 4),
                                              padding=(8, 8), scale=1.05)

    # draw the original bounding boxes
    for (x, y, w, h) in rects:
        cv2.rectangle(clone, (x, y), (x + w, y + h), (0, 0, 255), 2)

    # Applies non-max supression from imutils package to kick-off overlapped
    # boxes
    rects = np.array([[x, y, x + w, y + h] for (x, y, w, h) in rects])
    result = non_max_suppression(rects, probs=None, overlapThresh=0.65)
    
    # Result is a list of lists, storing the coordinates of the boxes
    # where the detector thinks that there is people. So...
    # Len of result = No people on image
    #print(result)
    return result


def detect_people(args, token):
    '''
    Main function. Not much else to say.
    '''
    image_path = args["image"]
    camera = True if str(args["camera"]) == 'true' else False

    # Routine to read local image
    if image_path != None and not camera: 
        print(GREEN + "[INFO]" + LIGHT_GRAY + " Image path provided, attempting to read image")
        (result, image) = local_detect(image_path)
        print(GREEN + "[INFO]" + LIGHT_GRAY + " sending results")
        
        # Sends the result to the server
        PEOPLE_ENTERING = len(result)
        res = auth.add_info(PEOPLE_ENTERING, STORE_PIN, token)
    
        if res != RED + "Can't add info" + LIGHT_GRAY:
            print("""
                People entering: {}
                People inside: {}
                Timestamp: {}
            """.format(res["info"]["peopleEntering"], res["info"]["peopleInside"], res["info"]["timestamp"])) 
        else:
            print(res)

        return

    # Routine to read images from webcam
    if camera:
        print(CYAN + "[INFO]" + LIGHT_GRAY + " reading camera images")
        camera_detect()


def local_detect(image_path):
    '''
    It takes a local image path as
    an argument an returns the same
    image but with people marked 
    inside funny boxes.
    '''

    result = []
    image = cv2.imread(image_path)
    image = imutils.resize(image, width=min(400, image.shape[1]))
    clone = image.copy()
    if len(image) <= 0:
        print(RED + "[ERROR]" + LIGHT_GRAY + " could not read your local image")
        return result
    print(GREEN + "[INFO]" + LIGHT_GRAY + " Detecting people")
    result = detector(image)

    # shows the result
    for (xA, yA, xB, yB) in result:
        cv2.rectangle(image, (xA, yA), (xB, yB), (0, 255, 0), 2)

    cv2.imshow("result", image)
    cv2.waitKey(0)
    cv2.destroyAllWindows()

    cv2.imwrite("result.png", np.hstack((clone, image)))
    return (result, image)


def camera_detect():
    '''
    This function is really self explanatory.
    '''
    cap = cv2.VideoCapture(0)
    init = time.time()

    while(True):
        # Capture frame-by-frame
        ret, frame = cap.read()
        frame = imutils.resize(frame, width=min(400, frame.shape[1]))
        result = detector(frame.copy())

        # shows the result
        for (xA, yA, xB, yB) in result:
            cv2.rectangle(frame, (xA, yA), (xB, yB), (0, 255, 0), 2)
        cv2.imshow('frame', frame)
        
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    # When everything done, release the capture
    cap.release()
    cv2.destroyAllWindows()

def args_parser():
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

def auth_user(pin):
    res = auth.signin(pin)
    if res["authToken"]:
        return res["authToken"]
    else: 
        return ""

def main():
    token = auth_user(STORE_PIN)
    args = args_parser()
    detect_people(args, token)

if __name__ == "__main__":
    main()