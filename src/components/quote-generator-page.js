"use client"

import { useState } from "react"
import { ArrowLeft } from "lucide-react"
import QuoteGenerator from "./quote-generator"
import "./quote-generator-page.css"

// This component serves as a page for generating and managing quotes.
// It provides options to save or send quotes to clients.

export default function QuoteGeneratorPage({ quoteRequest = null, onBack }) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSave = async (quoteData) => {
    setIsSubmitting(true)

    try {
      // In a real app, you would save the quote to your backend
      console.log("Saving quote:", quoteData)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Success
      alert("Quote saved successfully!")
    } catch (error) {
      console.error("Error saving quote:", error)
      alert("Failed to save quote. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSend = async (quoteData) => {
    setIsSubmitting(true)

    try {
      // In a real app, you would save the quote and send it to the client
      console.log("Sending quote:", quoteData)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Success
      alert("Quote sent to client successfully!")
    } catch (error) {
      console.error("Error sending quote:", error)
      alert("Failed to send quote. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="quote-generator-page">
      <div className="page-header">
        <button className="back-button" onClick={onBack}>
          <ArrowLeft className="back-icon" />
          Back to Quotes
        </button>

        <h1 className="page-title">{quoteRequest ? "Edit Quote" : "Create New Quote"}</h1>
      </div>

      {isSubmitting && (
        <div className="submitting-overlay">
          <div className="spinner"></div>
          <p>Processing your request...</p>
        </div>
      )}

      <QuoteGenerator quoteRequest={quoteRequest} onSave={handleSave} onSend={handleSend} />
    </div>
  )
}
