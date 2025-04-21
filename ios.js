// ios.js - iOS-specific logic for Polaroid Camera
// Handles filter baking and download for iOS devices where ctx.filter is not supported

// Utility: Detect if running on iOS
window.isIOS = function() {
  const isiOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  // alert('[iOS.js] isIOS: ' + isiOS + '\nUA: ' + navigator.userAgent);
  return isiOS;
};

// iOS-specific image download fallback: instruct user to long-press gallery image
window.downloadPolaroidIOS = function(imgObj, filters, filename) {
  alert('On iOS, direct image download is not supported.\n\nTo save your photo, please long-press the image and choose \"Save Image\"');
};
