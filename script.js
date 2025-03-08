const videoElement = document.getElementById('video');
const button = document.getElementById('button');
const resetButton = document.getElementById('resetButton');
const errorMessageElement = document.getElementById('error-message');
const errorDetailsElement = document.getElementById('error-details');

function showError(message) {
    errorDetailsElement.textContent = `Oops! Something went wrong: ${message}. Please try again or check your browser permissions.`;
    errorMessageElement.classList.remove('hidden');
}

function hideError() {
    errorMessageElement.classList.add('hidden');
}


async function selectMediaStream() {
    hideError();
    try {
        const mediaStream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
        videoElement.srcObject = mediaStream;
        videoElement.hidden = false;
        videoElement.onloadedmetadata = () => {
            videoElement.play();
        }

        mediaStream.getVideoTracks()[0].addEventListener('ended', () => {
            videoElement.hidden = true;
            button.textContent = 'START';
        });
    } catch (error) {
       showError(error.message)
    }
}
button.addEventListener('click', async () => {
    button.disabled = true;
    if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
        button.textContent = 'START';
    } else {
        videoElement.controls = true;
        videoElement.muted = true;
        await videoElement.requestPictureInPicture();
        button.textContent = 'Exit PiP';
    }
    button.disabled = false;
});

videoElement.addEventListener('leavepictureinpicture', () => {
    videoElement.controls = true;
    videoElement.muted = false;
    button.textContent = 'START';
});

resetButton.addEventListener('click', () => {
    selectMediaStream();
});
