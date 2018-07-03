# Face Extraction Demo with face-api.js

## What is this?

This is a simple JavaScript demo showing how to do face extraction using [face-api.js](https://github.com/justadudewhohacks/face-api.js).

![Screenshot](screenshot.png?raw=true "Screenshot")

Picture in screenshot from [PEXELS](https://www.pexels.com/).

## How to run the demo?

```sh
# Clone this repository
$ git clone https://github.com/gbcreation/face-extraction-with-face-api.js

# Go into the repository
$ cd face-extraction-with-face-api.js

# Install dependencies
$ yarn
# or
# $ npm install

# Run the app and automatically open it in the default browser
$ yarn start
# or
# $ npm start
```

## How to use it?

Load a picture using the Browse button or drag&drop a picture to the drop zone. Once the picture is loaded, click on the **Extract faces** button to extract faces. Detected faces are displayed below the original picture.

Move your mouse cursor over extracted faces to see their location in the original picture. A red box is drawn around the face. The number inside the box is the score of the detected face. The face landmarks are drawn in blue.

## Author

Gontran Baerts (Twitter: [@GontranBaerts](https://twitter.com/GontranBaerts))
