import { client } from './client'

export async function getFeaturedListings() {
  return client.fetch(`*[_type == "listing" && featured == true && status == "active"] | order(_createdAt desc) [0...6]`)
}

export async function getActiveListings() {
  return client.fetch(`*[_type == "listing" && status == "active"] | order(price desc)`)
}

export async function getSoldListings() {
  return client.fetch(`*[_type == "listing" && status == "sold"] | order(_createdAt desc)`)
}

export async function getListing(id: string) {
  return client.fetch(`*[_type == "listing" && _id == $id][0]`, { id })
}

export async function getTestimonials() {
  return client.fetch(`*[_type == "testimonial"] | order(_createdAt desc)`)
}

export async function getGalleryProjects() {
  return client.fetch(`*[_type == "galleryProject"] | order(_createdAt desc)`)
}

export async function getSiteSettings() {
  return client.fetch(`*[_type == "siteSettings"][0]`)
}
