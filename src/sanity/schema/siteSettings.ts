import { defineType, defineField } from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({ name: 'phone', title: 'Phone Number', type: 'string' }),
    defineField({ name: 'address', title: 'Office Address', type: 'string' }),
    defineField({ name: 'agentName', title: 'Agent Name', type: 'string' }),
    defineField({ name: 'agentBio', title: 'Agent Bio', type: 'text' }),
    defineField({ name: 'agentPhoto', title: 'Agent Photo', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'heroHeadline', title: 'Hero Headline', type: 'string' }),
    defineField({ name: 'heroSubtext', title: 'Hero Subtext', type: 'string' }),
  ],
})
