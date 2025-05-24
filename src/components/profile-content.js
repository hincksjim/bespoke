"use client"

import { useState } from "react"
import { Save } from "lucide-react"
import "./profile-content.css"

export default function ProfileContent({ artisanData }) {
  const [formData, setFormData] = useState({
    name: artisanData?.name || "",
    email: artisanData?.email || "",
    phone: artisanData?.phone || "",
    bio: artisanData?.bio || "",
    specialties: artisanData?.specialties || [],
    experience: artisanData?.experience || "",
    website: artisanData?.website || "",
    socialMedia: {
      instagram: artisanData?.socialMedia?.instagram || "",
      facebook: artisanData?.socialMedia?.facebook || "",
      twitter: artisanData?.socialMedia?.twitter || "",
    },
  })

  const handleChange = (e) => {
    const { name, value } = e.target

    if (name.includes(".")) {
      const [parent, child] = name.split(".")
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value,
        },
      })
    } else {
      setFormData({
        ...formData,
        [name]: value,
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // In a real app, you would update the profile in your backend
    console.log("Profile data to update:", formData)

    // Mock API call
    try {
      // const { dynamoDB } = initializeAWS()
      // const params = {
      //   TableName: "ArtisansTable",
      //   Key: { artisanId: artisanData.artisanId },
      //   UpdateExpression: "set #name = :name, email = :email, phone = :phone, bio = :bio, specialties = :specialties, experience = :experience, website = :website, socialMedia = :socialMedia",
      //   ExpressionAttributeNames: { "#name": "name" },
      //   ExpressionAttributeValues: {
      //     ":name": formData.name,
      //     ":email": formData.email,
      //     ":phone": formData.phone,
      //     ":bio": formData.bio,
      //     ":specialties": formData.specialties,
      //     ":experience": formData.experience,
      //     ":website": formData.website,
      //     ":socialMedia": formData.socialMedia
      //   },
      //   ReturnValues: "UPDATED_NEW"
      // }
      // await dynamoDB.update(params).promise()

      alert("Profile updated successfully!")
    } catch (error) {
      console.error("Error updating profile:", error)
      alert("Failed to update profile. Please try again.")
    }
  }

  return (
    <div className="profile">
      <h2 className="profile-title">My Profile</h2>

      <div className="profile-card">
        <form onSubmit={handleSubmit} className="profile-form">
          <div className="profile-layout">
            <div className="profile-sidebar">
              <div className="profile-image-container">
                <img
                  src={artisanData?.profileImage || "/placeholder.svg?height=200&width=200"}
                  alt="Profile"
                  className="profile-image"
                />

                <button type="button" className="change-photo-button">
                  Change Photo
                </button>
              </div>

              <div className="account-status-container">
                <h4 className="account-status-title">Account Status</h4>
                <div
                  className={`account-status ${
                    artisanData?.isActive ? "account-status-active" : "account-status-inactive"
                  }`}
                >
                  {artisanData?.isActive ? "Active" : "Inactive"}
                </div>
              </div>
            </div>

            <div className="profile-content">
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} className="form-input" />
                </div>

                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Website</label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Bio</label>
                <textarea name="bio" value={formData.bio} onChange={handleChange} rows={4} className="form-textarea" />
              </div>

              <div className="form-group">
                <label className="form-label">Experience</label>
                <select name="experience" value={formData.experience} onChange={handleChange} className="form-select">
                  <option value="">Select Experience Level</option>
                  <option value="1-3">1-3 years</option>
                  <option value="4-6">4-6 years</option>
                  <option value="7-10">7-10 years</option>
                  <option value="10+">10+ years</option>
                </select>
              </div>

              <div className="form-group">
                <h4 className="form-section-title">Social Media</h4>
                <div className="social-media-grid">
                  <div className="form-group">
                    <label className="form-label">Instagram</label>
                    <input
                      type="text"
                      name="socialMedia.instagram"
                      value={formData.socialMedia.instagram}
                      onChange={handleChange}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Facebook</label>
                    <input
                      type="text"
                      name="socialMedia.facebook"
                      value={formData.socialMedia.facebook}
                      onChange={handleChange}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Twitter</label>
                    <input
                      type="text"
                      name="socialMedia.twitter"
                      value={formData.socialMedia.twitter}
                      onChange={handleChange}
                      className="form-input"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="save-button">
              <Save className="save-icon" />
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
