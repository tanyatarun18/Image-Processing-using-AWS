async function uploadImage() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    if (!file) {
        alert("Please select an image to upload.");
        return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async function() {
        const base64Image = reader.result.split(',')[1];
        const response = await fetch('https://qcsvb81f7a.execute-api.ap-south-1.amazonaws.com/dev/upload', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'filename': file.name
            },
            body: JSON.stringify({ image: base64Image })
        });

        const result = await response.json();
        const messageDiv = document.getElementById('message');
        if (response.ok) {
            messageDiv.textContent = "Image uploaded successfully. Processing...";
            await checkProcessingStatus(file.name);
        } else {
            messageDiv.textContent = "Error uploading image: " + result;
        }
    };
}

async function checkProcessingStatus(filename) {
    const messageDiv = document.getElementById('message');
    let processedImageUrl = '';

    // Polling the server to check if the image processing is done
    for (let i = 0; i < 10; i++) {
        const response = await fetch('https://<api-id>.execute-api.<region>.amazonaws.com/dev/status', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ filename: filename })
        });

        const result = await response.json();
        if (response.ok && result.status === 'processed') {
            processedImageUrl = result.url;
            break;
        }
        await new Promise(resolve => setTimeout(resolve, 3000));  // Wait for 3 seconds before the next check
    }

    if (processedImageUrl) {
        messageDiv.textContent = "Image processed successfully!";
        const processedImage = document.getElementById('processedImage');
        processedImage.src = processedImageUrl;
        processedImage.style.display = 'block';
    } else {
        messageDiv.textContent = "Image processing failed or timed out.";
    }
}
