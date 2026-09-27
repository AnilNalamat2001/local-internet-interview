import { Link, useNavigate } from 'react-router-dom'

function Profile() {
  const navigate = useNavigate()

  const loggedInUser = JSON.parse(
    localStorage.getItem('loggedInUser'),
  )

  if (!loggedInUser) {
    return null
  }

  const handleLogout = () => {
    localStorage.removeItem('loggedInUser')
    navigate('/login')
  }

  const firstLetter =
    loggedInUser.name?.charAt(0).toUpperCase() || 'U'

  return (
    <main className="profile-page">

      <div className="profile-container">

        <Link to="/" className="profile-back-link">
          ← Back to Local Feed
        </Link>

        <section className="profile-card">

          <div className="profile-header">

            <div className="profile-large-avatar">
              {firstLetter}
            </div>

            <div>
              <h1>{loggedInUser.name}</h1>

              <p>
                Local Internet community member
              </p>
            </div>

          </div>

          <div className="profile-details">

            <div className="profile-detail">

              <span>👤</span>

              <div>
                <small>Name</small>
                <strong>{loggedInUser.name}</strong>
              </div>

            </div>

            <div className="profile-detail">

              <span>📧</span>

              <div>
                <small>Email</small>
                <strong>{loggedInUser.email}</strong>
              </div>

            </div>

            <div className="profile-detail">

              <span>📍</span>

              <div>
                <small>Area</small>
                <strong>
                  {loggedInUser.area || 'Not provided'}
                </strong>
              </div>

            </div>

            <div className="profile-detail">

              <span>🏙️</span>

              <div>
                <small>City</small>
                <strong>
                  {loggedInUser.city || 'Not provided'}
                </strong>
              </div>

            </div>

            <div className="profile-detail">

              <span>🆔</span>

              <div>
                <small>User ID</small>
                <strong>{loggedInUser.id}</strong>
              </div>

            </div>

          </div>

          <div className="profile-actions">

            <button
              type="button"
              onClick={handleLogout}
              className="profile-logout-button"
            >
              Logout
            </button>

          </div>

        </section>

      </div>

    </main>
  )
}

export default Profile