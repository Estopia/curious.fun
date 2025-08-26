import React from 'react'
import Card from '../components/Card'

const experiences = [
  {
    title: "Life in Weeks",
    description: "see your life in a 52×90 week grid",
    href: "/experiences/life-in-weeks"
  },
  {
    title: "Spend a Trillion Lite",
    description: "try to spend an absurd budget",
    href: "/experiences/spend-a-trillion-lite"
  },
  {
    title: "Internet Minute",
    description: "discover what happens every 60 seconds online",
    href: "/experiences/internet-minute"
  },
  {
    title: "Color Naming Game",
    description: "is it blue or green?",
    href: "/experiences/color-naming"
  }
]

export default function HomePage() {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {experiences.map((experience) => (
          <Card
            key={experience.title}
            title={experience.title}
            description={experience.description}
            href={experience.href}
          />
        ))}
      </div>
    </div>
  )
}
