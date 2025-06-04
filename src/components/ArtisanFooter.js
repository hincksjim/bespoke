import React from "react"

const ArtisanFooter = () => {
  const currentYear = new Date().getFullYear()
  return (
    <footer className="dashboard-footer">
      <a href="/terms" target="_blank" rel="noopener noreferrer">
        Terms & Conditions
      </a>
      <span> | </span>
      <a href="/privacy" target="_blank" rel="noopener noreferrer">
        Privacy Policy
      </a>
      <p>&copy; {currentYear} Elegance Jewellery. All rights reserved.</p>
    </footer>
  )
}

export default ArtisanFooter