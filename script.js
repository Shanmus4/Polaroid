document.addEventListener('DOMContentLoaded', () => {
  console.log('DOMContentLoaded event fired!');

  const shutterButton = document.querySelector('.camera .top .shutter');
  const cameraView = document.getElementById('camera-view');
  const cameraViewContainer = document.getElementById('camera-view-container');

  // Access the camera
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(function (stream) {
        // Set the video source to the stream
        cameraView.srcObject = stream;
      })
      .catch(function (error) {
        console.error('Unable to access camera:', error);
      });
  } else {
    console.error('getUserMedia() not supported.');
  }

  // Polaroid filter toggle
  const filterButton = document.createElement('button');
  filterButton.textContent = 'Toggle Polaroid Filter';
  filterButton.style.marginTop = '10px'; // Add some spacing
  cameraViewContainer.appendChild(filterButton);

  filterButton.addEventListener('click', () => {
    cameraView.classList.toggle('polaroid-filter');
  });

  if (shutterButton) {
    shutterButton.addEventListener('click', () => {
      console.log('Shutter clicked!');
    });

    shutterButton.addEventListener('mousedown', () => {
      shutterButton.style.transform = 'scale(0.95)';
    });
    shutterButton.addEventListener('mouseup', () => {
      shutterButton.style.transform = 'scale(1)';
    });
    shutterButton.addEventListener('mouseleave', () => {
      shutterButton.style.transform = 'scale(1)';
    });
  } else {
    console.error('Shutter button element not found!');
  }
});
