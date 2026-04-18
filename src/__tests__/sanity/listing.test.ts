import { listing } from '@/sanity/schema/listing'

describe('listing schema', () => {
  it('has required name and title', () => {
    expect(listing.name).toBe('listing')
    expect(listing.title).toBe('Listing')
  })

  it('has address field', () => {
    const fields = listing.fields.map((f: any) => f.name)
    expect(fields).toContain('address')
  })

  it('has status field with active and sold options', () => {
    const status = listing.fields.find((f: any) => f.name === 'status')
    const options = status?.options?.list?.map((o: any) => o.value)
    expect(options).toContain('active')
    expect(options).toContain('sold')
  })
})
