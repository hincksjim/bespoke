import React from "react"

const ArtisanMetricCard = ({ title, value, description }) => (
  <div className="metric-card">
    <h3>{title}</h3>
    <p className="metric-value">{value}</p>
    {description && <p className="metric-description">{description}</p>}
  </div>
)

export default ArtisanMetricCard