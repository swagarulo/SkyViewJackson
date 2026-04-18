// Mock for @/sanity/image to avoid ESM issues in Jest
export const urlFor = () => ({ width: () => ({ height: () => ({ url: () => null }) }) })
