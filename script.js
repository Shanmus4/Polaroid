document.addEventListener('DOMContentLoaded', () => {
  console.log('DOMContentLoaded event fired!');

  const shutterButton = document.querySelector('.camera .top .shutter');
  const cameraView = document.getElementById('camera-view');
  const cameraViewContainer = document.getElementById('camera-view-container');
  const leftArrow = document.querySelector('.polaroid-arrow-left');
  const rightArrow = document.querySelector('.polaroid-arrow-right');
  const fabDownload = document.getElementById('fab-download');
  const polaroidCaptureArea = document.getElementById('polaroid-capture-area');
  const filters = [
    {
      name: 'None',
      css: ''
    },
    {
      name: 'Warm',
      css: 'hue-rotate(-10deg) saturate(1.25) brightness(1.08) contrast(1.10)'
    },
    {
      name: 'Cool',
      css: 'hue-rotate(30deg) saturate(1.2) brightness(1.05) contrast(1.08)'
    },
    {
      name: 'Retro',
      css: 'hue-rotate(-35deg) saturate(0.8) brightness(1.05) contrast(1.18) sepia(0.18)'
    },
    {
      name: 'Vivid',
      css: 'saturate(1.7) brightness(1.12) contrast(1.22)'
    }
  ];
  let filterIndex = 0;

  // Store captured images as data URLs in localStorage
  let polaroidImages = JSON.parse(localStorage.getItem('polaroidImages') || '[]');

  function updateFilter() {
    if (filters[filterIndex].css) {
      cameraView.style.filter = filters[filterIndex].css;
    } else {
      cameraView.style.filter = '';
    }
    cameraView.setAttribute('aria-label', filters[filterIndex].name + ' filter');
  }

  // Helper: capture polaroid as image (with white border)
  async function capturePolaroid() {
    const video = cameraView;
    const polaroidDiv = polaroidCaptureArea;
    // Use CSS width/height and padding for precise placement
    const style = getComputedStyle(polaroidDiv);
    const paddingLeft = parseFloat(style.paddingLeft);
    const paddingTop = parseFloat(style.paddingTop);
    const paddingRight = parseFloat(style.paddingRight);
    const paddingBottom = parseFloat(style.paddingBottom);
    const width = polaroidDiv.clientWidth;
    const height = polaroidDiv.clientHeight;
    const videoEl = video;
    const videoWidth = videoEl.clientWidth;
    const videoHeight = videoEl.clientHeight;
    const dpr = window.devicePixelRatio || 1;
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    // Draw white background (for border)
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, width, height);
    // Draw the video at the correct offset (padding), matching CSS
    ctx.filter = getComputedStyle(videoEl).filter;
    ctx.drawImage(
      videoEl,
      0, 0, videoEl.videoWidth, videoEl.videoHeight,
      paddingLeft, paddingTop, videoWidth, videoHeight
    );
    // Save as data URL
    const dataUrl = canvas.toDataURL('image/png');
    polaroidImages.push(dataUrl);
    localStorage.setItem('polaroidImages', JSON.stringify(polaroidImages));
    return dataUrl;
  }

  function scaleCameraToHeight() {
    const camera = document.querySelector('.camera');
    const wrapper = document.querySelector('.camera-scale-wrapper');
    if (!camera || !wrapper) return;
    // The camera's natural height (e.g., 470px)
    const naturalHeight = 470;
    const parent = document.querySelector('.camera-parent');
    const available = parent.clientHeight;
    const scale = Math.min(available / naturalHeight, 1); // Never scale above 1
    wrapper.style.transform = `scale(${scale})`;
  }

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

  if (shutterButton) {
    shutterButton.addEventListener('click', async () => {
      await capturePolaroid();
      console.log('Polaroid captured and saved!');
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

  if (leftArrow && rightArrow) {
    leftArrow.addEventListener('click', () => {
      filterIndex = (filterIndex - 1 + filters.length) % filters.length;
      updateFilter();
    });
    rightArrow.addEventListener('click', () => {
      filterIndex = (filterIndex + 1) % filters.length;
      updateFilter();
    });
    // Keyboard accessibility
    leftArrow.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        filterIndex = (filterIndex - 1 + filters.length) % filters.length;
        updateFilter();
      }
    });
    rightArrow.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        filterIndex = (filterIndex + 1) % filters.length;
        updateFilter();
      }
    });
  }

  if (fabDownload) {
    fabDownload.addEventListener('click', () => {
      if (!polaroidImages.length) return;
      const url = polaroidImages[polaroidImages.length - 1];
      const a = document.createElement('a');
      a.href = url;
      a.download = 'polaroid-photo.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  }

  updateFilter();
  scaleCameraToHeight();
  window.addEventListener('resize', scaleCameraToHeight);
});