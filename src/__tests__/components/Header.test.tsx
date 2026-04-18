import { render, screen } from '@testing-library/react'
import { Header } from '@/components/Header'

describe('Header', () => {
  it('renders the Sky View Homes logo text', () => {
    render(<Header phone="731-444-1665" />)
    expect(screen.getByText(/Sky View Homes/i)).toBeInTheDocument()
  })

  it('renders navigation links', () => {
    render(<Header phone="731-444-1665" />)
    expect(screen.getByRole('link', { name: /listings/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /about/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /contact/i })).toBeInTheDocument()
  })

  it('renders phone number', () => {
    render(<Header phone="731-444-1665" />)
    expect(screen.getByText('731-444-1665')).toBeInTheDocument()
  })
})
