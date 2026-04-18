import { defineType, defineField } from 'sanity'

export const testimonial = defineType({
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Client Name', type: 'string', validation: r => r.required() }),
    defineField({ name: 'quote', title: 'Quote', type: 'text', validation: r => r.required() }),
    defineField({ name: 'rating', title: 'Rating (1-5)', type: 'number', validation: r => r.required().min(1).max(5) }),
  ],
})
