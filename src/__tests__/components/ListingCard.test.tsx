import { render, screen } from '@testing-library/react'
import { ListingCard } from '@/components/ListingCard'

jest.mock('../../sanity/image', () => ({
  urlFor: () => ({ width: () => ({ height: () => ({ url: () => null }) }) }),
}))

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ alt }: { alt: string }) => <img alt={alt} />,
}))

const mockListing = {
  _id: '1',
  address: '123 Main St, Jackson, TN',
  price: 285000,
  beds: 3,
  baths: 2,
  sqft: 1800,
  status: 'active',
  photos: [],
}

describe('ListingCard', () => {
  it('displays address', () => {
    render(<ListingCard listing={mockListing} />)
    expect(screen.getByText('123 Main St, Jackson, TN')).toBeInTheDocument()
  })

  it('displays formatted price', () => {
    render(<ListingCard listing={mockListing} />)
    expect(screen.getByText(/\$285,000/)).toBeInTheDocument()
  })

  it('displays bed/bath/sqft', () => {
    render(<ListingCard listing={mockListing} />)
    expect(screen.getByText(/3 bed/i)).toBeInTheDocument()
    expect(screen.getByText(/2 bath/i)).toBeInTheDocument()
    expect(screen.getByText(/1,800/)).toBeInTheDocument()
  })
})
