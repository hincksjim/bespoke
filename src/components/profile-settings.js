const ProfileSettings = ({ userAttributes }) => {
  return (
    <div className="profile-settings">
      <h2>Profile Settings</h2>
      <p>Manage your profile information here.</p>
      <div className="profile-info">
        <p>
          <strong>Name:</strong> {userAttributes?.given_name} {userAttributes?.family_name}
        </p>
        <p>
          <strong>Email:</strong> {userAttributes?.email}
        </p>
        {/* Add more fields and edit functionality as needed */}
      </div>
      <button className="action-button">Edit Profile</button>
    </div>
  )
}

export default ProfileSettings
