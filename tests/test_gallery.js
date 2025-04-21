// tests/test_gallery.js
// Unit tests for gallery modal logic
// Run with a JS test runner (e.g. Jest, Vitest, or browser-based runner)

// Mock localStorage for testing
global.localStorage = {
  store: {},
  getItem(key) { return this.store[key] || null; },
  setItem(key, value) { this.store[key] = value; },
  removeItem(key) { delete this.store[key]; },
  clear() { this.store = {}; }
};

const { getGalleryImages, addGalleryImage, removeGalleryImage } = require('../script');

describe('Gallery Modal Logic', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('addGalleryImage adds an image to storage', () => {
    addGalleryImage('img1');
    expect(getGalleryImages()).toEqual(['img1']);
  });

  test('getGalleryImages returns all images', () => {
    addGalleryImage('img1');
    addGalleryImage('img2');
    expect(getGalleryImages()).toEqual(['img1', 'img2']);
  });

  test('removeGalleryImage removes an image', () => {
    addGalleryImage('img1');
    addGalleryImage('img2');
    removeGalleryImage('img1');
    expect(getGalleryImages()).toEqual(['img2']);
  });

  test('returns empty array if no images', () => {
    expect(getGalleryImages()).toEqual([]);
  });
});
