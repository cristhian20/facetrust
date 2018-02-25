# import the necessary packages
import numpy as np
import argparse
import cv2
from socketIO_client import SocketIO, LoggingNamespace
import requests
import base64



'''
TODO:
- implement video stream
- only send average percent values of the past 10 seconds
'''


# construct the argument parse and parse the arguments
ap = argparse.ArgumentParser()
ap.add_argument("-i", "--image", help="path to the image")
args = vars(ap.parse_args())

# define fire filters

def calculatePercent(numpyarray):
    countBlack = 0.0
    countTotal = 0.0

    numRows = len(numpyarray)
    numCols = len(numpyarray[0])

    # print numRows
    # print numCols

    for row in range(0, numRows):
        for col in range(0, numCols):
            if numpyarray[row][col] > 0:
                countBlack = countBlack + 1

            countTotal = countTotal + 1

    print countBlack
    print countTotal

    return countBlack / countTotal

    # for pixel in numpyarray:
    #     print pixel
        # if pixel > 0:
        #     countBlack = countBlack + 1;
        # countTotal = countTotal + 1

    #print countBlack / countTotal


# load the image
image = cv2.imread(args["image"])

# define the list of boundaries
boundaries = [
    ([5,50,190],[90,160,255]) #fire?
]

# loop over the boundaries
for (lower, upper) in boundaries:
    # create NumPy arrays from the boundaries
    lower = np.array(lower, dtype="uint8")
    upper = np.array(upper, dtype="uint8")

    # find the colors within the specified boundaries and apply
    # the mask
    mask = cv2.inRange(image, lower, upper)
    output = cv2.bitwise_and(image, image, mask=mask)

    print mask.shape
    print mask.size

    percentFire = calculatePercent(mask.tolist())

    imageToSend = base64.b64encode(image)

    print percentFire
    print imageToSend

    # with SocketIO('localhost', 8000, LoggingNamespace) as socketIO:
    # socketIO.emit('aaa', 1, open(args['image'], 'rb'))
    # socketIO.wait(seconds=1)

    if percentFire > 0.003:
      status = requests.post("http://localhost:9002/tweet",
      data={ 'code': 1, 'picture': imageToSend })
      print status.status_code




    # show the images
    #cv2.imshow("images", np.hstack([image, output]))
    cv2.imshow("images", mask)

    cv2.waitKey(0)