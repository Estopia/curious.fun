import React from "react";

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center py-16">
        <h1 className="text-3xl font-bold mb-8">about curious.fun</h1>
        <div className="text-gray-400 space-y-4">
          <p>
            A collection of small interactive experiences designed to spark curiosity
            and provide moments of wonder.
          </p>
          <p>
            Inspired by <a href="https://www.neal.fun" target="_blank" rel="noopener noreferrer">neal.fun</a>, and the simple joy of discovering something new, each experience
            is crafted to be playful, educational, and fun.
          </p>
        </div>
      </div>
    </div>
  )
}
