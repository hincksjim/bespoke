import React from "react"

const ArtisanHeader = ({ theme, toggleTheme }) => {
  return (
    <header className="dashboard-header">
      <div className="header-controls">
        <button
          onClick={toggleTheme}
          className="theme-toggle-button"
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          {theme === "light" ? "Dark Theme🌙" : "Light Theme☀️"}
        </button>
      </div>
    </header>
  )
}

export default ArtisanHeader