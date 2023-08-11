const videoElement = document.getElementById('camera');
const canvas = document.getElementById('outputCanvas');
const ctx = canvas.getContext('2d');

async function startCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoElement.srcObject = stream;
    } catch (error) {
        console.error('Error accessing camera:', error);
    }
}

startCamera();

// Get an API key from Clarifai and replace 'YOUR_API_KEY' with your actual key
const apiKey = '22af1c94ba9f41b09ed027d46179c4b2';
const apiUrl = 'https://api.clarifai.com/v2/models/aaa03c23b3724a16a56b629203edc62c/outputs';

async function recognizeObjects(imageData) {
    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            inputs: [{ data: { image: { base64: imageData } } }]
        })
    });

    const data = await response.json();
    return data.outputs[0].data.concepts;
}

videoElement.addEventListener('play', async () => {
    const FPS = 5; // Adjust the frame rate as needed
    const interval = 1000 / FPS;

    setInterval(async () => {
        ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
        const imageData = canvas.toDataURL('image/jpeg', 0.7).split(',')[1];
        
        const recognizedObjects = await recognizeObjects(imageData);

        // Display the recognized objects on the page
        // Modify this part to update your UI with the recognized objects
        console.log('Recognized Objects:', recognizedObjects);
    }, interval);
});
