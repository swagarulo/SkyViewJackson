import { defineType, defineField } from 'sanity'

export const galleryProject = defineType({
  name: 'galleryProject',
  title: 'Gallery Project',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Project Title', type: 'string', validation: r => r.required() }),
    defineField({ name: 'category', title: 'Category', type: 'string' }),
    defineField({ name: 'photos', title: 'Photos', type: 'array', of: [{ type: 'image', options: { hotspot: true } }] }),
  ],
})
