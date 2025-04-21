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
    { name: 'None', css: 'none' },
    { name: 'Warm', css: 'sepia(0.22) hue-rotate(-14deg) saturate(1.45) brightness(1.11) contrast(1.23)' },
    { name: 'Cool', css: 'grayscale(0.19) hue-rotate(40deg) saturate(1.25) brightness(1.07) contrast(1.15)' },
    { name: 'Retro', css: 'sepia(0.48) hue-rotate(-48deg) saturate(0.75) brightness(1.02) contrast(1.35)' },
    { name: 'Vivid', css: 'saturate(2.25) brightness(1.18) contrast(1.36)' },
    { name: 'Sharp', css: 'contrast(1.45) brightness(1.09) saturate(1.18)' },
    { name: 'B&W', css: 'grayscale(1) brightness(1.08) contrast(1.25)' },
    { name: 'Night', css: 'brightness(0.68) contrast(1.32) saturate(0.72) hue-rotate(-16deg)' },
    { name: 'Glow', css: 'brightness(1.22) contrast(1.12) saturate(1.45)' },
    { name: 'Fade', css: 'grayscale(0.65) brightness(1.18) contrast(0.85)' }
  ];
  let filterIndex = 0;

  // Store captured images as data URLs in localStorage
  let polaroidImages = JSON.parse(localStorage.getItem('polaroidImages') || '[]');

  // Helper: returns the filter class name for a given filter index
  function getFilterClass(idx) {
    return 'filter-' + filters[idx].name.toLowerCase().replace(/[^a-z0-9]/g, '');
  }

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
    const width = 259.2;
    const height = 324;
    const exportScale = 2;
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(width * exportScale);
    canvas.height = Math.round(height * exportScale);
    const ctx = canvas.getContext('2d');
    ctx.scale(exportScale, exportScale);
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, width, height);
    const paddingLeft = 10.8;
    const paddingTop = 10.8;
    const paddingRight = 10.8;
    const frameW = width - paddingLeft - paddingRight;
    const frameH = 273.6;
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
    // Platform detection
    const isiOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    let dataUrl;
    if (!isiOS) {
      // Desktop/Android: bake in filter
      let filterString = getComputedStyle(videoEl).filter;
      if ('filter' in ctx && filterString && filterString !== 'none') {
        ctx.filter = filterString;
      }
      ctx.drawImage(videoEl, sx, sy, sw, sh, paddingLeft, paddingTop, frameW, frameH);
      ctx.filter = 'none';
      dataUrl = canvas.toDataURL('image/png');
      let polaroidImages = JSON.parse(localStorage.getItem('polaroidImages') || '[]');
      polaroidImages.push({ dataUrl, filterIndex });
      localStorage.setItem('polaroidImages', JSON.stringify(polaroidImages));
      return dataUrl;
    } else {
      // iOS: save unfiltered image + filterIndex
      ctx.drawImage(videoEl, sx, sy, sw, sh, paddingLeft, paddingTop, frameW, frameH);
      dataUrl = canvas.toDataURL('image/png');
      let polaroidImages = JSON.parse(localStorage.getItem('polaroidImages') || '[]');
      polaroidImages.push({ dataUrl, filterIndex });
      localStorage.setItem('polaroidImages', JSON.stringify(polaroidImages));
      return dataUrl;
    }
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

  // Camera flip support
  let currentFacingMode = 'user';
  let hasFrontBackCamera = false;

  function isMobileDevice() {
    // Use matchMedia for touch/mobile detection as well as userAgent fallback
    return (
      (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) ||
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    );
  }

  // Check for multiple cameras and show flip button if available -- only on mobile
  async function checkCameraFlipSupport() {
    const flipBtn = document.getElementById('camera-flip-btn');
    // iOS browsers (including Chrome) do not expose enumerateDevices until getUserMedia is called and permission granted
    let isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    if (isIOS) {
      // On iOS, always show the flip button (since enumerateDevices is unreliable, but most iPhones/iPads have both cameras)
      if (flipBtn) flipBtn.style.display = '';
      hasFrontBackCamera = true;
      return;
    }
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) return;
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoInputs = devices.filter(d => d.kind === 'videoinput');
    if (videoInputs.length > 1 && isMobileDevice()) {
      hasFrontBackCamera = true;
      if (flipBtn) flipBtn.style.display = '';
    } else {
      hasFrontBackCamera = false;
      if (flipBtn) flipBtn.style.display = 'none';
    }
  }

  // Flip camera logic
  async function flipCamera() {
    currentFacingMode = (currentFacingMode === 'user') ? 'environment' : 'user';
    await startCamera(currentFacingMode);
  }

  // Mirror effect for user (front) camera
  function updateCameraMirror() {
    const video = document.getElementById('camera-view');
    if (currentFacingMode === 'user') {
      video.style.transform = 'scaleX(-1)';
    } else {
      video.style.transform = '';
    }
  }

  // Update startCamera to accept facingMode
  async function startCamera(facingMode = 'user') {
    const constraints = {
      video: {
        facingMode: { exact: facingMode }
      },
      audio: false
    };
    const video = document.getElementById('camera-view');
    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      video.srcObject = stream;
      video.play();
      updateCameraMirror();
    } catch (e) {
      // fallback: try without facingMode constraint
      try {
        const fallbackStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        video.srcObject = fallbackStream;
        video.play();
        updateCameraMirror();
      } catch (err) {
        alert('Unable to access camera.');
      }
    }
  }

  // Ensure camera starts on load
  startCamera();

  // Access the camera
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    // startCamera() is called above
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

  checkCameraFlipSupport();
  const flipBtn = document.getElementById('camera-flip-btn');
  if (flipBtn) {
    flipBtn.addEventListener('click', flipCamera);
  }

  // Keyboard support for switching filters (left/right arrows)
  document.addEventListener('keydown', (e) => {
    if (document.body.classList.contains('gallery-open')) return; // Don't interfere when gallery is open
    if (e.key === 'ArrowLeft') {
      filterIndex = (filterIndex - 1 + filters.length) % filters.length;
      updateFilter();
      e.preventDefault();
    } else if (e.key === 'ArrowRight') {
      filterIndex = (filterIndex + 1) % filters.length;
      updateFilter();
      e.preventDefault();
    }
  });

  // --- GALLERY LOGIC ---
  // Exported helpers for testability
  window.getGalleryImages = function getGalleryImages() {
    return JSON.parse(localStorage.getItem('polaroidImages') || '[]');
  };
  window.addGalleryImage = function addGalleryImage(imgObj) {
    let imgs = JSON.parse(localStorage.getItem('polaroidImages') || '[]');
    imgs.push(imgObj);
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

  // --- GALLERY MODAL ANIMATION LOGIC ---
  // Add animation classes for smooth open/close
  function animateOpenGallery() {
    renderGallery();
    // Always clear animation classes first
    galleryModal.classList.remove('gallery-modal--open', 'gallery-modal--close');
    galleryModal.style.display = 'flex';
    // Force reflow to ensure transition
    void galleryModal.offsetWidth;
    galleryModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    document.body.classList.add('gallery-open');
    // Add open class in next animation frame for transition
    requestAnimationFrame(() => {
      galleryModal.classList.add('gallery-modal--open');
      galleryModal.focus();
    });
  }
  function animateCloseGallery() {
    // Only close if open
    if (!galleryModal.classList.contains('gallery-modal--open')) return;
    galleryModal.classList.remove('gallery-modal--open');
    galleryModal.classList.add('gallery-modal--close');
    // Remove any previous handler, then add
    galleryModal.removeEventListener('transitionend', galleryModal._closeHandler);
    galleryModal._closeHandler = function handler(e) {
      if (e.target === galleryModal) {
        galleryModal.style.display = 'none';
        galleryModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        document.body.classList.remove('gallery-open');
        galleryModal.removeEventListener('transitionend', galleryModal._closeHandler);
      }
    };
    galleryModal.addEventListener('transitionend', galleryModal._closeHandler);
  }
  // Replace openGallery/closeGallery with animated versions
  function openGallery() { animateOpenGallery(); }
  function closeGallery() { animateCloseGallery(); }

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
    images.forEach((imgObj, idx) => {
      const container = document.createElement('div');
      container.className = 'gallery-image-container';
      const image = document.createElement('img');
      image.className = 'gallery-image';
      image.src = imgObj.dataUrl;
      image.alt = `Polaroid ${idx+1}`;
      // Apply filter visually in gallery (iOS workaround)
      if (typeof imgObj.filterIndex !== 'undefined' && filters[imgObj.filterIndex] && filters[imgObj.filterIndex].css) {
        image.style.filter = filters[imgObj.filterIndex].css;
      } else {
        image.style.filter = '';
      }
      // Button row (right aligned)
      const btnRow = document.createElement('div');
      btnRow.className = 'gallery-btn-row';
      // Download button
      const downloadBtn = document.createElement('button');
      downloadBtn.className = 'gallery-download-btn';
      downloadBtn.title = 'Download';
      downloadBtn.innerHTML = '<span class="material-symbols-outlined">download</span>';
      downloadBtn.addEventListener('click', () => downloadImageWithFilter(imgObj, `polaroid-${idx+1}.png`));
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

  // Download helper: bake filter into download
  async function downloadImageWithFilter(imgObj, filename) {
    // Platform detection
    const isiOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    // If not iOS, just download the original dataUrl (already has filter and frame)
    if (!isiOS) {
      downloadImage(imgObj.dataUrl, filename);
      return;
    }
    // On iOS, re-render and apply the filter if needed
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.src = imgObj.dataUrl;
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
    });
    const width = 259.2, height = 324, exportScale = 2;
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(width * exportScale);
    canvas.height = Math.round(height * exportScale);
    const ctx = canvas.getContext('2d');
    ctx.scale(exportScale, exportScale);
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, width, height);
    const paddingLeft = 10.8, paddingTop = 10.8, paddingRight = 10.8;
    const frameW = width - paddingLeft - paddingRight;
    const frameH = 273.6;
    // Apply filter if present
    if (typeof imgObj.filterIndex !== 'undefined' && filters[imgObj.filterIndex] && filters[imgObj.filterIndex].css && 'filter' in ctx) {
      ctx.filter = filters[imgObj.filterIndex].css;
    } else {
      ctx.filter = 'none';
    }
    ctx.drawImage(img, paddingLeft, paddingTop, frameW, frameH);
    ctx.filter = 'none';
    const dataUrl = canvas.toDataURL('image/png');
    downloadImage(dataUrl, filename);
  }

  function downloadAllImages() {
    const images = window.getGalleryImages();
    if (!images.length) return;
    images.forEach((imgObj, i) => {
      downloadImageWithFilter(imgObj, `polaroid-${i+1}.png`);
    });
  }
  if (galleryDownloadAll) {
    galleryDownloadAll.addEventListener('click', downloadAllImages);
  }

  // --- END GALLERY LOGIC ---
});