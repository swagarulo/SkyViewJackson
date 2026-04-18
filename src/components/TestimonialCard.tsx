interface TestimonialProps { name: string; quote: string; rating: number }

export function TestimonialCard({ name, quote, rating }: TestimonialProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-[#c9a84c]">
      <div className="flex mb-3">
        {Array.from({ length: rating }).map((_, i) => (
          <span key={i} className="text-[#c9a84c] text-xl">★</span>
        ))}
      </div>
      <p className="text-gray-700 italic mb-4">"{quote}"</p>
      <p className="font-semibold text-[#1a2744]">— {name}</p>
    </div>
  )
}
