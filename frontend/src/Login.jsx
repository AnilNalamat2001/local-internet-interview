
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const handleLogin = async () => {
    if (!email.trim()) {
      setMessage('Email is required')
      return
    }

    if (!password.trim()) {
      setMessage('Password is required')
      return
    }

    setLoading(true)
    setMessage('')

    try {
      const response = await fetch(
        'http://localhost:8081/auth/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            password,
          }),
        },
      )

      const data = await response.json()

      if (!response.ok) {
        setMessage(
          data.message || 'Invalid email or password',
        )
        return
      }

      localStorage.setItem(
        'loggedInUser',
        JSON.stringify(data),
      )

      navigate('/')
    } catch (error) {
      console.error(error)
      setMessage('Could not connect to the server.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <style>
        {`
          .ai-login-page {
            min-height: 100vh;
            background:
              radial-gradient(circle at 15% 15%, rgba(37,99,235,0.12), transparent 30%),
              radial-gradient(circle at 85% 80%, rgba(124,58,237,0.08), transparent 30%),
              #f8fafc;
            color: #111827;
            font-family: Arial, Helvetica, sans-serif;
          }

          .ai-login-top {
            padding: 22px 6%;
            background: rgba(255,255,255,0.96);
            border-bottom: 1px solid #e5e7eb;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 25px;
          }

          .ai-login-brand {
            display: flex;
            align-items: center;
            gap: 12px;
          }

          .ai-login-logo {
            width: 44px;
            height: 44px;
            border-radius: 12px;
            background: #2563eb;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 22px;
          }

          .ai-login-brand h1 {
            margin: 0;
            font-size: 22px;
          }

          .ai-login-brand p {
            margin: 3px 0 0;
            color: #6b7280;
            font-size: 12px;
          }

          .ai-login-form-top {
            display: flex;
            align-items: center;
            gap: 8px;
          }

          .ai-login-form-top input {
            width: 175px;
            padding: 10px 12px;
            border: 1px solid #d1d5db;
            border-radius: 8px;
            outline: none;
            background: white;
          }

          .ai-login-form-top input:focus {
            border-color: #2563eb;
          }

          .ai-login-form-top button {
            padding: 10px 17px;
            border: none;
            border-radius: 8px;
            background: #2563eb;
            color: white;
            font-weight: 700;
            cursor: pointer;
          }

          .ai-login-form-top button:hover {
            background: #1d4ed8;
          }

          .ai-login-form-top button:disabled {
            background: #93c5fd;
          }

          .ai-login-main {
            max-width: 1180px;
            margin: 0 auto;
            padding: 55px 25px 70px;
          }

          .ai-login-hero {
            text-align: center;
            max-width: 850px;
            margin: 0 auto;
          }

          .ai-login-badge {
            display: inline-block;
            padding: 7px 12px;
            border-radius: 20px;
            background: #eff6ff;
            color: #1d4ed8;
            font-size: 11px;
            font-weight: 800;
            letter-spacing: 0.5px;
          }

          .ai-login-hero h2 {
            margin: 18px 0 14px;
            font-size: clamp(34px, 5vw, 58px);
            line-height: 1.05;
            letter-spacing: -1.5px;
          }

          .ai-login-hero h2 span {
            color: #2563eb;
          }

          .ai-login-hero p {
            max-width: 700px;
            margin: 0 auto;
            color: #6b7280;
            font-size: 16px;
            line-height: 1.7;
          }

          .ai-workflow {
            margin-top: 40px;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 18px;
          }

          .ai-panel {
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 18px;
            padding: 22px;
            box-shadow: 0 12px 35px rgba(15,23,42,0.06);
          }

          .ai-panel-title {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 15px;
          }

          .ai-panel-icon {
            width: 38px;
            height: 38px;
            border-radius: 10px;
            background: #eff6ff;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 19px;
          }

          .ai-panel-title strong {
            display: block;
            font-size: 14px;
          }

          .ai-panel-title small {
            color: #9ca3af;
            font-size: 11px;
          }

          .ai-user-post {
            padding: 15px;
            border-radius: 12px;
            background: #f8fafc;
            color: #374151;
            font-size: 14px;
            line-height: 1.6;
          }

          .ai-extraction {
            margin-top: 12px;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
          }

          .ai-data {
            padding: 10px;
            border-radius: 9px;
            background: #f8fafc;
            border: 1px solid #e5e7eb;
          }

          .ai-data small {
            display: block;
            color: #9ca3af;
            font-size: 9px;
          }

          .ai-data strong {
            display: block;
            margin-top: 3px;
            font-size: 11px;
          }

          .ai-feature-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
          }

          .ai-feature {
            padding: 13px;
            border: 1px solid #e5e7eb;
            border-radius: 11px;
            background: #ffffff;
          }

          .ai-feature-icon {
            font-size: 20px;
          }

          .ai-feature strong {
            display: block;
            margin-top: 7px;
            font-size: 12px;
          }

          .ai-feature p {
            margin: 4px 0 0;
            color: #9ca3af;
            font-size: 10px;
            line-height: 1.4;
          }

          .ai-capabilities {
            margin-top: 18px;
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 10px;
          }

          .ai-capability {
            padding: 14px;
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 12px;
            text-align: center;
          }

          .ai-capability span {
            font-size: 22px;
          }

          .ai-capability strong {
            display: block;
            margin-top: 6px;
            font-size: 11px;
          }

          .ai-capability small {
            display: block;
            margin-top: 3px;
            color: #9ca3af;
            font-size: 9px;
          }

          .ai-bottom {
            margin-top: 35px;
            text-align: center;
          }

          .ai-bottom p {
            color: #6b7280;
            font-size: 13px;
          }

          .ai-register-link {
            color: #2563eb;
            font-weight: 700;
            text-decoration: none;
          }

          .ai-register-link:hover {
            text-decoration: underline;
          }

          .ai-login-error {
            margin: 8px 0 0;
            color: #b91c1c;
            font-size: 11px;
          }

          @media (max-width: 850px) {
            .ai-login-top {
              flex-direction: column;
              align-items: stretch;
            }

            .ai-login-form-top {
              flex-wrap: wrap;
            }

            .ai-login-form-top input {
              flex: 1;
              min-width: 140px;
            }

            .ai-workflow {
              grid-template-columns: 1fr;
            }

            .ai-capabilities {
              grid-template-columns: 1fr 1fr;
            }
          }

          @media (max-width: 550px) {
            .ai-login-main {
              padding: 35px 15px 50px;
            }

            .ai-login-form-top {
              display: grid;
              grid-template-columns: 1fr;
            }

            .ai-login-form-top input,
            .ai-login-form-top button {
              width: 100%;
            }

            .ai-feature-grid,
            .ai-extraction {
              grid-template-columns: 1fr;
            }

            .ai-capabilities {
              grid-template-columns: 1fr 1fr;
            }
          }
        `}
      </style>

      <main className="ai-login-page">

        <header className="ai-login-top">

          <div className="ai-login-brand">

            <div className="ai-login-logo">
              🌐
            </div>

            <div>
              <h1>Local Internet</h1>

              <p>
                Intelligent local community platform
              </p>
            </div>

          </div>

          <div className="ai-login-form-top">

            <input
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              placeholder="Email"
            />

            <input
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  handleLogin()
                }
              }}
              placeholder="Password"
            />

            <button
              type="button"
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

          </div>

        </header>

        <section className="ai-login-main">

          <div className="ai-login-hero">

            <span className="ai-login-badge">
              🤖 AI-POWERED LOCAL INTELLIGENCE
            </span>

            <h2>
              Understand what is
              <span> happening around you.</span>
            </h2>

            <p>
              Local Internet transforms ordinary community
              posts into structured local intelligence using
              AI-powered intent, topic, location and urgency
              detection.
            </p>

            {message && (
              <p className="ai-login-error">
                {message}
              </p>
            )}

          </div>

          <div className="ai-workflow">

            <div className="ai-panel">

              <div className="ai-panel-title">

                <div className="ai-panel-icon">
                  💬
                </div>

                <div>
                  <strong>
                    Natural Language Input
                  </strong>

                  <small>
                    What a user actually writes
                  </small>
                </div>

              </div>

              <div className="ai-user-post">
                🚗 “My bike broke down near Madhapur.
                Need a mechanic urgently.”
              </div>

            </div>

            <div className="ai-panel">

              <div className="ai-panel-title">

                <div className="ai-panel-icon">
                  🤖
                </div>

                <div>
                  <strong>
                    AI Understanding
                  </strong>

                  <small>
                    Structured intelligence extracted
                  </small>
                </div>

              </div>

              <div className="ai-extraction">

                <div className="ai-data">
                  <small>Intent</small>
                  <strong>🎯 NEED</strong>
                </div>

                <div className="ai-data">
                  <small>Topic</small>
                  <strong>🚗 VEHICLE</strong>
                </div>

                <div className="ai-data">
                  <small>Location</small>
                  <strong>📍 Madhapur</strong>
                </div>

                <div className="ai-data">
                  <small>Urgency</small>
                  <strong>⚡ HIGH</strong>
                </div>

              </div>

            </div>

          </div>

          <div className="ai-panel" style={{ marginTop: '18px' }}>

            <div className="ai-panel-title">

              <div className="ai-panel-icon">
                🧠
              </div>

              <div>
                <strong>
                  AI-Powered Community Features
                </strong>

                <small>
                  Designed around real local information
                </small>
              </div>

            </div>

            <div className="ai-feature-grid">

              <div className="ai-feature">
                <span className="ai-feature-icon">
                  🚗
                </span>

                <strong>
                  Vehicle & Road Intelligence
                </strong>

                <p>
                  Understand breakdowns, mechanics,
                  traffic and road problems.
                </p>
              </div>

              <div className="ai-feature">
                <span className="ai-feature-icon">
                  💼
                </span>

                <strong>
                  Jobs & Opportunities
                </strong>

                <p>
                  Identify local jobs, hiring and
                  work-related requests.
                </p>
              </div>

              <div className="ai-feature">
                <span className="ai-feature-icon">
                  🚨
                </span>

                <strong>
                  Local Alerts
                </strong>

                <p>
                  Detect urgent situations such as
                  accidents, fire or flooding.
                </p>
              </div>

              <div className="ai-feature">
                <span className="ai-feature-icon">
                  🎉
                </span>

                <strong>
                  Events & Community
                </strong>

                <p>
                  Understand meetings, programs,
                  festivals and local activities.
                </p>
              </div>

            </div>

          </div>

          <div className="ai-capabilities">

            <div className="ai-capability">
              <span>🎯</span>
              <strong>Intent Detection</strong>
              <small>ASK / NEED / OFFER</small>
            </div>

            <div className="ai-capability">
              <span>📍</span>
              <strong>Location Detection</strong>
              <small>Local area extraction</small>
            </div>

            <div className="ai-capability">
              <span>⚡</span>
              <strong>Urgency Detection</strong>
              <small>HIGH / MEDIUM / LOW</small>
            </div>

            <div className="ai-capability">
              <span>🔎</span>
              <strong>Smart Search</strong>
              <small>Find useful local posts</small>
            </div>

          </div>

          <div className="ai-bottom">

            <p>
              New to Local Internet?{' '}
              <Link
                to="/register"
                className="ai-register-link"
              >
                Create your community account
              </Link>
            </p>

          </div>

        </section>

      </main>
    </>
  )
}

export default Login

