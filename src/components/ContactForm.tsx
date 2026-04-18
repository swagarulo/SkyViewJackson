'use client'
import { useState } from 'react'

interface ContactFormProps {
  listingAddress?: string
  formName?: string
}

export function ContactForm({ listingAddress, formName = 'listing-inquiry' }: ContactFormProps) {
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState(false)

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <p className="text-green-700 font-semibold">Thank you! Mari will be in touch shortly.</p>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(false)
    const form = e.currentTarget
    const data = new URLSearchParams()
    new FormData(form).forEach((value, key) => data.append(key, value.toString()))
    try {
      await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: data.toString(),
      })
      setSubmitted(true)
    } catch {
      setError(true)
    }
  }

  return (
    <form
      name={formName}
      method="POST"
      data-netlify="true"
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      <input type="hidden" name="form-name" value={formName} />
      {listingAddress && <input type="hidden" name="listing" value={listingAddress} />}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
        <input required name="name" type="text" className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#c9a84c]" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
        <input required name="email" type="email" className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#c9a84c]" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
        <input name="phone" type="tel" className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#c9a84c]" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
        <textarea
          name="message"
          rows={4}
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#c9a84c]"
          defaultValue={listingAddress ? `I'm interested in ${listingAddress}.` : ''}
        />
      </div>
      {error && <p className="text-red-600 text-sm">Something went wrong. Please call us directly.</p>}
      <button type="submit" className="w-full bg-[#c9a84c] text-[#1a2744] font-bold py-3 rounded hover:bg-[#d4b96a] transition-colors">
        Send Inquiry
      </button>
    </form>
  )
}
