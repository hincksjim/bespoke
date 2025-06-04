// artisan-console.js
"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { useAuthenticator } from "@aws-amplify/ui-react"
import { useNavigate } from "react-router-dom"
import { generateClient } from "aws-amplify/api"
import { listCreations } from "../graphql/queries"
import ArtisanSidebar from "./ArtisanSidebar"
import ArtisanHeader from "./ArtisanHeader"
import ArtisanFooter from "./ArtisanFooter"
import ArtisanDashboardOverview from "./ArtisanDashboardOverview"
import ArtisanEnhancedQuoteRequestsList from "./ArtisanEnhancedQuoteRequestsList"
import ArtisanRespondedQuotesList from "./ArtisanRespondedQuotesList"
import ArtisanEnhancedRejectedQuotesList from "./ArtisanEnhancedRejectedQuotesList"
import ArtisanWonQuotesList from "./ArtisanWonQuotesList"
import ArtisanProfileSettings from "./ArtisanProfileSettings"
import ArtisanPaymentPage from "./ArtisanPaymentPage"

import "./artisan-console.css"

// Initialize the GraphQL client
const client = generateClient()

// Add the formatDate function
const formatDate = (dateString) => {
  if (!dateString) return "N/A"
  
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return "Invalid Date"
    
    // Format as "MMM DD, YYYY" (e.g., "Apr 28, 2024")
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    })
  } catch (error) {
    console.error("Error formatting date:", error)
    return "Invalid Date"
  }
}

// Function to transform GraphQL Creation data to Quote Request format
const transformCreationToQuote = (creation) => {
  return {
    id: creation.id,
    clientName: creation.clientName || creation.owner || "Unknown Client",
    clientLocation: creation.location || creation.clientLocation || "N/A",
    requirements: creation.description || creation.requirements || creation.title || "No description",
    submissionDate: creation.createdAt || creation.submissionDate,
    status: creation.status || "New",
    type: creation.type || creation.category || "General",
    material: creation.material || creation.materials || "N/A",
    estimatedValue: creation.estimatedValue || creation.budget || 0,
    completionDate: creation.completionDate || creation.updatedAt,
    finalPrice: creation.finalPrice || creation.actualCost,
    // Add any other fields from your Creation schema
    imageUrl: creation.imageUrl,
    notes: creation.notes,
    priority: creation.priority || "Medium"
  }
}

const calculateGrowthRate = (quotes) => {
  if (!Array.isArray(quotes) || quotes.length === 0) return 0

  const currentMonth = new Date().getMonth()
  const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1

  const currentMonthQuotes = quotes.filter(
    (q) => q.status === "Completed" && new Date(q.completionDate).getMonth() === currentMonth,
  ).length

  const lastMonthQuotes = quotes.filter(
    (q) => q.status === "Completed" && new Date(q.completionDate).getMonth() === lastMonth,
  ).length

  if (lastMonthQuotes === 0) return currentMonthQuotes > 0 ? 100 : 0

  return Math.round(((currentMonthQuotes - lastMonthQuotes) / lastMonthQuotes) * 100)
}

const ArtisanConsole = ({ signOut }) => {
  const [artisanLoading, setArtisanLoading] = useState(true)
  const [userAttributes, setUserAttributes] = useState({})
  const [error, setError] = useState(null)
  const [activeSection, setActiveSection] = useState("overview")
  const [theme, setTheme] = useState("light")
  const [quotesLoading, setQuotesLoading] = useState(false)
  const [quotesError, setQuotesError] = useState(null)
  const [allQuotes, setAllQuotes] = useState([])
  const [creationsData, setCreationsData] = useState([])

  const { authStatus } = useAuthenticator((context) => [context.authStatus])

  useEffect(() => {
    const getUserAttributes = async () => {
      setArtisanLoading(true)
      setError(null)
      try {
        setUserAttributes({
          given_name: "Artisan",
          family_name: "User",
          email: "artisan@example.com",
        })
      } catch (err) {
        console.error("Error fetching user attributes:", err)
        setError(err)
      } finally {
        setArtisanLoading(false)
      }
    }
    getUserAttributes()
  }, [authStatus])

  // Fetch real data from GraphQL
  useEffect(() => {
    const fetchCreations = async () => {
      setQuotesLoading(true)
      setQuotesError(null)
      
      try {
        console.log("Fetching creations from GraphQL...")
        const result = await client.graphql({
          query: listCreations,
          variables: {
            filter: { 
              submittedforquote: { eq: true }
            },
            limit: 100
          }
        })

        console.log("GraphQL result:", result)
        
        if (result.data && result.data.listCreations) {
          const creations = result.data.listCreations.items || []
          
          // Double-check filtering on client side as well
          const quotableCreations = creations.filter(creation => creation.submittedforquote === true)
          
          setCreationsData(quotableCreations)
          
          // Transform creations to quote format
          const transformedQuotes = quotableCreations.map(transformCreationToQuote)
          setAllQuotes(transformedQuotes)
          
          console.log(`Fetched ${creations.length} total creations, ${quotableCreations.length} submitted for quote:`, transformedQuotes)
        } else {
          console.warn("No creations data found in response")
          setAllQuotes([])
        }
      } catch (err) {
        console.error("Error fetching creations:", err)
        setQuotesError(err)
        
        // Fallback to mock data if GraphQL fails
        console.log("Falling back to mock data...")
        setAllQuotes([
          {
            id: "mock-q1",
            clientName: "Alice Smith",
            clientLocation: "London, UK",
            requirements: "Custom gold ring with diamond",
            submissionDate: "2024-04-28",
            status: "New",
            type: "Ring",
            material: "Gold",
            estimatedValue: 1500,
          },
          {
            id: "mock-q2",
            clientName: "Bob Johnson",
            clientLocation: "New York, USA",
            requirements: "Silver necklace repair",
            submissionDate: "2024-04-27",
            status: "Completed",
            type: "Repair",
            material: "Silver",
            completionDate: "2024-05-15",
            estimatedValue: 500,
            finalPrice: 450,
          },
        ])
      } finally {
        setQuotesLoading(false)
      }
    }

    fetchCreations()
  }, [authStatus])

  const quotesForSection = useMemo(() => {
    switch (activeSection) {
      case "responded":
        return allQuotes.filter((q) => q.status === "Responded")
      case "accepted":
        return allQuotes.filter((q) => q.status === "Accepted" || q.status === "Completed")
      case "rejected":
        return allQuotes.filter((q) => q.status === "Rejected" || q.status === "Cancelled")
      default:
        return allQuotes
    }
  }, [activeSection, allQuotes])

  const toggleTheme = useCallback(() => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"))
  }, [])

  useEffect(() => {
    document.body.className = theme + "-theme"
    return () => {
      document.body.className = ""
    }
  }, [theme])

  if (artisanLoading) {
    return <div className="loading">Loading Artisan Console...</div>
  }

  if (error) {
    return (
      <div className="error-state">
        Error loading dashboard: {error.message}. Please try signing out and back in.
        <button onClick={signOut}>Sign Out</button>
      </div>
    )
  }

  const artisanName = userAttributes.given_name || userAttributes.email || "Artisan"

  return (
    <div className={`artisan-dashboard-container ${theme}-theme`}>
      <ArtisanSidebar
        artisanName={artisanName}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        onSignOut={signOut}
      />
      <div className="main-content-area">
        <ArtisanHeader theme={theme} toggleTheme={toggleTheme} onSignOut={signOut} />
        <main className="dashboard-content">
          {activeSection === "overview" && (
            <ArtisanDashboardOverview 
              quotes={allQuotes} 
              setActiveSection={setActiveSection}
              formatDate={formatDate}
              isLoading={quotesLoading}
              error={quotesError}
            />
          )}
          {activeSection === "quote-requests" && (
            <ArtisanEnhancedQuoteRequestsList 
              quotes={allQuotes}
              formatDate={formatDate}
              isLoading={quotesLoading}
              error={quotesError}
              rawCreationsData={creationsData}
            />
          )}
          {activeSection === "responded" && (
            <ArtisanRespondedQuotesList
              quotes={quotesForSection}
              sectionTitle="Responded Quotes"
              isLoading={quotesLoading}
              error={quotesError}
              formatDate={formatDate}
            />
          )}
          {activeSection === "accepted" && (
            <ArtisanWonQuotesList
              quotes={quotesForSection}
              sectionTitle="Accepted/Won Quotes"
              isLoading={quotesLoading}
              error={quotesError}
              formatDate={formatDate}
            />
          )}
          {activeSection === "rejected" && (
            <ArtisanEnhancedRejectedQuotesList
              quotes={quotesForSection}
              sectionTitle="Rejected/Lost Quotes"
              isLoading={quotesLoading}
              error={quotesError}
              formatDate={formatDate}
            />
          )}
          {activeSection === "subscription" && <ArtisanPaymentPage />}
          {activeSection === "settings" && <ArtisanProfileSettings userAttributes={userAttributes} />}
        </main>
        <ArtisanFooter />
      </div>
    </div>
  )
}

export default ArtisanConsole



