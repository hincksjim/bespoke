"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import QuoteGeneratorPage from "./quote-generator-page"
import ".create-quote-button.css"

export default function CreateQuoteButton() {
  const [showQuoteGenerator, setShowQuoteGenerator] = useState(false)

  const handleClick = () => {
    setShowQuoteGenerator(true)
  }

  const handleBack = () => {
    setShowQuoteGenerator(false)
  }

  if (showQuoteGenerator) {
    return <QuoteGeneratorPage onBack={handleBack} />
  }

  return (
    <button className="create-quote-button" onClick={handleClick}>
      <Plus className="create-quote-icon" />
      Create New Quote
    </button>
  )
}
