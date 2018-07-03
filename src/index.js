// Import the face-api.js module
const faceapi = require('face-api.js')

// Once the HTML page is fully loaded, initialize the app
window.addEventListener('load', () => {

    // Add event listener to "change" event emitted by the <input type="file">
    // element to load a local picture using the form input.
    document.getElementById('browse').addEventListener(
        'change',
        handleFileSelect,
        false
    )

    // Event listener for the extract button
    document.getElementById('extract').addEventListener(
        'click',
        extractFaces,
        false
    )

    // Setup the drag & drop event listeners
    var dropZone = document.getElementById('dd-area')
    dropZone.addEventListener('dragover', handleDragOver, false)
    dropZone.addEventListener('dragleave', handleDragLeave, false)
    dropZone.addEventListener('drop', handleFileDrop, false)

    // Load all model data for face detection, face landmarks and face
    // recognition
    loadFaceDetectionModel()
})

/**
 * Load all model data for face detection, face landmarks and face recognition.
 * @return {undefined}
 */
async function loadFaceDetectionModel() {
    await faceapi.loadModels('/')
}

/**
 * Event listener called when a local file is selected with the Browse button.
 * @param {Event} event The Change event
 * @return {undefined}
 */
function handleFileSelect(event) {
    loadPicture(event.target.files[0])
}

/**
 * Event listener called when a file is dragged over the drop zone.
 * @param {DragEvent} event The Drag event
 * @return {undefined}
 */
function handleDragOver(event) {
    event.stopPropagation()
    event.preventDefault()
    event.dataTransfer.dropEffect = 'copy'
    event.target.classList.add('hover')
}

/**
 * Event listener called when a dragged file leaves the drop zone.
 * @param {DragEvent} event The Drag event
 * @return {undefined}
 */
function handleDragLeave(event) {
    event.stopPropagation()
    event.preventDefault()
    event.target.classList.remove('hover')
}

/**
 * Event listener called when a file is dropped over the drop zone.
 * @param {DragEvent} event The Drag event
 * @return {undefined}
 */
function handleFileDrop(event) {
    event.stopPropagation()
    event.preventDefault()
    loadPicture(event.dataTransfer.files[0])
    event.target.classList.remove('hover')
}

/**
 * Load a local picture and display it using a new IMG tag added to the
 * #container DIV.
 * @param {File} file Object containing info about the file to load
 * @return {undefined}
 */
function loadPicture(file) {
    if (file.type.match('image.*')) {

        // Disable the Extract Faces button while the picture is loaded
        document.getElementById('extract').disabled = true

        const reader = new FileReader()
        reader.onload = function(event) {

            const pictureContainer = document.getElementById('container')

            // Remove previous picture if any
            const oldImg = document.getElementById('picture')
            if (oldImg) {
                pictureContainer.removeChild(oldImg)
            }

            // Create a new IMG element to display the loaded picture
            const img = document.createElement('img')
            img.onload = onPictureLoaded
            img.id = "picture"
            img.src = event.target.result
            pictureContainer.insertBefore(img, pictureContainer.lastElementChild)

            // Clear the DIV containing previous extracted faces
            document.getElementById('faces').innerHTML = ""
        }
        reader.readAsDataURL(file)
    }
}

/**
 * Event listener called when the selected picture is loaded.
 * @param {Event} file The Load event
 * @return {undefined}
 * @see loadPicture()
 */
function onPictureLoaded(event) {
    // Enable the Extract Faces button while the picture is loaded
    document.getElementById('extract').disabled = false

    // Set the canvas used to draw face box and landmarks to the same size as
    // the loaded picture
    const overlay = document.getElementById('overlay')
    const picture = document.getElementById('picture')
    overlay.width = picture.width
    overlay.height = picture.height
}

/**
 * Event listener called when the user clicks on the Extract Faces button.
 * Use face-api.js to analyze the picture and get info about detected faces.
 * Detected faces are extracted and displayed below the image using CANVAS
 * elements. They can be hovered with the mouse to show their location on the
 * original picture.
 * @param {MouseEvent} event The MouseClick event
 * @return {undefined}
 */
function extractFaces(event) {

    // Clear the DIV containing previous extracted faces
    document.getElementById('faces').innerHTML = ""

    // Get all detected faces with a score > 0.5
    faceapi.allFaces(picture, 0.5)
        .then(detections => {
            detections.forEach(function(face) {
                // Get box info about the detected face
                const faceBox = face.detection.getBox()
                const width = Math.round(faceBox.width)
                const height = Math.round(faceBox.height)

                const canvas = document.createElement('canvas')
                canvas.width = width
                canvas.height = height

                const ctx = canvas.getContext('2d')
                ctx.drawImage(picture, Math.round(faceBox.x), Math.round(faceBox.y), width, height, 0, 0, width, height)

                canvas.addEventListener('mouseover', onFaceMouseOver, false)
                canvas.addEventListener('mouseout', onFaceMouseOut, false)
                canvas.face = face

                document.getElementById('faces').appendChild(canvas)
            })
            console.log(detections)
        })
}

/**
 * Event listener called when the user moves the mouse cursor over an extracted
 * face. Show the location of the face in the original picture by drawing a box
 * around it and its landmarks.
 * @param {MouseEvent} event The MouseOver event
 * @return {undefined}
 */
function onFaceMouseOver(event) {
    const overlay = document.getElementById('overlay')
    const face = event.target.face
    faceapi.drawDetection(overlay, face.detection, {color: 'red'})
    faceapi.drawLandmarks(overlay, face.landmarks, { drawLines: true })
}

/**
 * Event listener called when the user moves the mouse cursor out of an
 * extracted face. Clear the canvas in which the face box and landmarks have
 * been drawn.
 * @param {MouseEvent} event The MouseOut event
 * @return {undefined}
 */
function onFaceMouseOut() {
    const overlay = document.getElementById('overlay')
    overlay.getContext('2d').clearRect(0, 0, overlay.width, overlay.height)
}

