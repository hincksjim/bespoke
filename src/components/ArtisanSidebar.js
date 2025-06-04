import React from "react"
import { LayoutDashboard, Inbox, Reply, CheckCircle, XCircle, Settings, LogOut, CreditCard } from "lucide-react"

const ArtisanSidebar = ({ artisanName, activeSection, setActiveSection, onSignOut }) => {
  const navItems = [
    { id: "overview", label: "Dashboard Overview", icon: LayoutDashboard },
    { id: "quote-requests", label: "Quote Requests", icon: Inbox },
    { id: "responded", label: "Responded Quotes", icon: Reply },
    { id: "accepted", label: "Accepted/Won Quotes", icon: CheckCircle },
    { id: "rejected", label: "Rejected/Lost Quotes", icon: XCircle },
    { id: "subscription", label: "Manage Subscription", icon: CreditCard },
  ]

  return (
    <aside className="dashboard-sidebar">
      <div className="sidebar-profile">
        <div className="profile-picture-placeholder" aria-hidden="true"></div>
        <span className="artisan-name">{artisanName || "Artisan Name"}</span>
      </div>
      <nav className="sidebar-nav" aria-label="Dashboard Navigation">
        <ul>
          {navItems.map((item) => {
            const IconComponent = item.icon
            return (
              <li key={item.id}>
                <button
                  className={`nav-button ${activeSection === item.id ? "active" : ""}`}
                  onClick={() => setActiveSection(item.id)}
                  aria-current={activeSection === item.id ? "page" : undefined}
                  title={item.label}
                >
                  <IconComponent className="nav-icon" aria-hidden="true" size={20} />
                  <span className="nav-label">{item.label}</span>
                </button>
              </li>
            )
          })}
        </ul>
      </nav>
      <div className="sidebar-footer-nav">
        <button
          className="nav-button settings-button"
          onClick={() => setActiveSection("settings")}
          title="Profile Settings"
        >
          <Settings className="nav-icon" aria-hidden="true" size={20} />
          <span className="nav-label">Profile Settings</span>
        </button>
        <button className="nav-button logout-button" onClick={onSignOut} title="Logout">
          <LogOut className="nav-icon" aria-hidden="true" size={20} />
          <span className="nav-label">Logout</span>
        </button>
      </div>
    </aside>
  )
}

export default ArtisanSidebar