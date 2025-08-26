interface CardProps {
  title: string
  description: string
  href: string
}

export default function Card({ title, description, href }: CardProps) {
  return (
    <div className="rounded-lg border border-neutral-800 p-4 hover:scale-105 hover:bg-neutral-900 transition-transform duration-200 group cursor-pointer">
      <h3 className="text-lg font-semibold mb-2 text-white group-hover:text-gray-100">
        {title}
      </h3>
      <p className="text-gray-400 text-sm mb-4 group-hover:text-gray-300">
        {description}
      </p>
      <a 
        href={href}
        className="inline-block text-sm text-blue-400 hover:text-blue-300 transition-colors font-medium"
      >
        open →
      </a>
    </div>
  )
}
