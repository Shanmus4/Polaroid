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
    // Outer polaroid size (matches .polaroid-white CSS):
    const width = 259.2; // px
    const height = 324;  // px
    const dpr = Math.max(window.devicePixelRatio, 2);
    const exportScale = 2;
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(width * exportScale);
    canvas.height = Math.round(height * exportScale);
    const ctx = canvas.getContext('2d');
    ctx.scale(exportScale, exportScale);
    // Draw white background for full polaroid (including thick bottom border)
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, width, height);
    // Padding matches .polaroid-white: 10.8px left/right/top, 0px bottom
    const paddingLeft = 10.8;
    const paddingTop = 10.8;
    const paddingRight = 10.8;
    // The bottom border is the remaining space
    const frameW = width - paddingLeft - paddingRight;
    const frameH = 273.6; // matches #camera-view height
    // Calculate the crop area in the video based on the frame aspect ratio and object-fit: cover
    const videoEl = video;
    const videoWidth = videoEl.videoWidth;
    const videoHeight = videoEl.videoHeight;
    const frameAspect = frameW / frameH;
    const videoAspect = videoWidth / videoHeight;
    let sx, sy, sw, sh;
    if (videoAspect > frameAspect) {
      sh = videoHeight;
      sw = frameAspect * sh;
      sx = (videoWidth - sw) / 2;
      sy = 0;
    } else {
      sw = videoWidth;
      sh = sw / frameAspect;
      sx = 0;
      sy = (videoHeight - sh) / 2;
    }
    // Draw the cropped video into the frame area (with correct padding, leaving thick white bottom)
    ctx.filter = getComputedStyle(videoEl).filter;
    ctx.drawImage(
      videoEl,
      sx, sy, sw, sh,
      paddingLeft, paddingTop, frameW, frameH
    );
    // Save as data URL
    const dataUrl = canvas.toDataURL('image/png');
    let polaroidImages = JSON.parse(localStorage.getItem('polaroidImages') || '[]');
    polaroidImages.push(dataUrl);
    localStorage.setItem('polaroidImages', JSON.stringify(polaroidImages));
    return dataUrl;
  }

  function scaleCameraToFit() {
    const wrapper = document.querySelector('.camera-scale-wrapper');
    const parent = document.querySelector('.camera-parent');
    const naturalWidth = 570;
    const naturalHeight = 470;
    const availableHeight = parent.clientHeight;
    const availableWidth = parent.clientWidth;
    const scaleH = availableHeight / naturalHeight;
    const scaleW = availableWidth / naturalWidth;
    const scale = Math.min(scaleH, scaleW, 1); // Never scale above 1
    wrapper.style.transform = `scale(${scale})`;
  }

  function positionPolaroidBelowCamera() {
    const cameraWrapper = document.querySelector('.camera-scale-wrapper');
    const polaroid = document.querySelector('.polaroid-parent');
    if (!cameraWrapper || !polaroid) return;
    // Get bounding box of camera relative to stacking context
    const cameraRect = cameraWrapper.getBoundingClientRect();
    const stackRect = cameraWrapper.offsetParent.getBoundingClientRect();
    // Calculate top offset: camera bottom relative to stack + 16px gap
    const top = cameraRect.bottom - stackRect.top + 12;
    polaroid.style.top = `${top}px`;
    polaroid.style.left = '50%';
    polaroid.style.transform = 'translateX(-50%)';
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
    fabDownload.removeEventListener && fabDownload.removeEventListener('click', openGallery); // Defensive, but safe
    fabDownload.onclick = openGallery;
  }

  updateFilter();
  scaleCameraToFit();
  positionPolaroidBelowCamera();
  window.addEventListener('resize', scaleCameraToFit);
  window.addEventListener('resize', positionPolaroidBelowCamera);
  window.addEventListener('DOMContentLoaded', positionPolaroidBelowCamera);
  // Also call after camera scaling (if any)
  if (typeof scaleCameraToFit === 'function') {
    window.addEventListener('resize', () => setTimeout(positionPolaroidBelowCamera, 10));
  }

  // --- GALLERY LOGIC ---
  // Exported helpers for testability
  window.getGalleryImages = function getGalleryImages() {
    return JSON.parse(localStorage.getItem('polaroidImages') || '[]');
  };
  window.addGalleryImage = function addGalleryImage(img) {
    let imgs = JSON.parse(localStorage.getItem('polaroidImages') || '[]');
    imgs.push(img);
    localStorage.setItem('polaroidImages', JSON.stringify(imgs));
  };
  window.removeGalleryImage = function removeGalleryImage(index) {
    let imgs = JSON.parse(localStorage.getItem('polaroidImages') || '[]');
    imgs.splice(index, 1);
    localStorage.setItem('polaroidImages', JSON.stringify(imgs));
  };

  // Modal open/close logic
  const galleryModal = document.getElementById('gallery-modal');
  const galleryGrid = document.getElementById('gallery-grid');
  const galleryClose = document.querySelector('.gallery-close');
  const galleryDownloadAll = document.getElementById('gallery-download-all');

  function openGallery() {
    renderGallery();
    galleryModal.style.display = 'flex';
    galleryModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    document.body.classList.add('gallery-open');
    galleryModal.focus();
  }
  function closeGallery() {
    galleryModal.style.display = 'none';
    galleryModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    document.body.classList.remove('gallery-open');
  }

  if (galleryClose) {
    galleryClose.addEventListener('click', closeGallery);
  }
  if (galleryModal) {
    galleryModal.addEventListener('mousedown', (e) => {
      if (e.target === galleryModal || e.target.classList.contains('gallery-backdrop')) closeGallery();
    });
    galleryModal.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeGallery();
    });
  }

  // Render gallery grid
  function renderGallery() {
    const images = window.getGalleryImages();
    galleryGrid.innerHTML = '';
    if (!images.length) {
      galleryGrid.innerHTML = '<div class="gallery-grid-empty">No polaroids yet.</div>';
      galleryDownloadAll.style.display = 'none';
      return;
    }
    images.forEach((img, idx) => {
      const container = document.createElement('div');
      container.className = 'gallery-image-container';
      const image = document.createElement('img');
      image.className = 'gallery-image';
      image.src = img;
      image.alt = `Polaroid ${idx+1}`;
      // Button row (right aligned)
      const btnRow = document.createElement('div');
      btnRow.className = 'gallery-btn-row';
      // Download button
      const downloadBtn = document.createElement('button');
      downloadBtn.className = 'gallery-download-btn';
      downloadBtn.title = 'Download';
      downloadBtn.innerHTML = '<span class="material-symbols-outlined">download</span>';
      downloadBtn.addEventListener('click', () => downloadImage(img, `polaroid-${idx+1}.png`));
      // Delete button
      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'gallery-delete-btn';
      deleteBtn.title = 'Delete';
      deleteBtn.innerHTML = '<span class="material-symbols-outlined">delete</span>';
      deleteBtn.addEventListener('click', () => {
        window.removeGalleryImage(idx);
        renderGallery();
      });
      btnRow.appendChild(downloadBtn);
      btnRow.appendChild(deleteBtn);
      container.appendChild(image);
      container.appendChild(btnRow);
      galleryGrid.appendChild(container);
    });
    galleryDownloadAll.style.display = '';
  }

  // Download helpers
  function downloadImage(dataUrl, filename) {
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  function downloadAllImages() {
    const images = window.getGalleryImages();
    if (!images.length) return;
    // Use JSZip for ZIP creation (inject if not present)
    if (typeof JSZip === 'undefined') {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
      script.onload = () => zipAndDownload(images);
      document.body.appendChild(script);
    } else {
      zipAndDownload(images);
    }
  }
  function zipAndDownload(images) {
    const zip = new JSZip();
    images.forEach((img, i) => {
      zip.file(`polaroid-${i+1}.png`, img.split(',')[1], {base64:true});
    });
    zip.generateAsync({type:'blob'}).then(blob => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'polaroids.zip';
      document.body.appendChild(a);
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      document.body.removeChild(a);
    });
  }
  if (galleryDownloadAll) {
    galleryDownloadAll.addEventListener('click', downloadAllImages);
  }

  // --- END GALLERY LOGIC ---
});