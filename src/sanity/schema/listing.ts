import { defineType, defineField } from 'sanity'

export const listing = defineType({
  name: 'listing',
  title: 'Listing',
  type: 'document',
  fields: [
    defineField({ name: 'address', title: 'Address', type: 'string', validation: r => r.required() }),
    defineField({ name: 'price', title: 'Price', type: 'number' }),
    defineField({ name: 'beds', title: 'Bedrooms', type: 'number' }),
    defineField({ name: 'baths', title: 'Bathrooms', type: 'number' }),
    defineField({ name: 'sqft', title: 'Square Feet', type: 'number' }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: { list: [{ title: 'Active', value: 'active' }, { title: 'Sold', value: 'sold' }] },
      validation: r => r.required(),
    }),
    defineField({ name: 'featured', title: 'Featured on Homepage', type: 'boolean', initialValue: false }),
    defineField({ name: 'description', title: 'Description', type: 'text' }),
    defineField({ name: 'photos', title: 'Photos', type: 'array', of: [{ type: 'image', options: { hotspot: true } }] }),
    defineField({ name: 'floorPlan', title: 'Floor Plan', type: 'image' }),
  ],
  orderings: [{ title: 'Price, High to Low', name: 'priceDesc', by: [{ field: 'price', direction: 'desc' }] }],
})
