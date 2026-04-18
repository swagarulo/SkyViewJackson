// Mock for @sanity/image-url to avoid ESM issues in Jest
const mockBuilder = {
  image: () => ({
    width: () => ({ height: () => ({ url: () => 'https://mock-image-url.com/image.jpg' }) }),
  }),
}

function createImageUrlBuilder() {
  return mockBuilder
}

module.exports = createImageUrlBuilder
