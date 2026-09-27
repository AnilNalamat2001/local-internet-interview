import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Register() {
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [area, setArea] = useState('')
  const [city, setCity] = useState('')

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleRegister = async (event) => {
    event.preventDefault()

    setLoading(true)
    setMessage('')

    try {
      const response = await fetch(
        'http://localhost:8081/auth/register',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name,
            email,
            password,
            area,
            city,
          }),
        },
      )

      const data = await response.json()

      if (!response.ok) {
        setMessage(
          data.email ||
          data.password ||
          data.name ||
          data.area ||
          data.city ||
          data.message ||
          'Registration failed.',
        )

        return
      }

      setMessage(
        'Registration successful. Redirecting to login...',
      )

      setTimeout(() => {
        navigate('/login')
      }, 1000)

    } catch (error) {
      console.error(error)

      setMessage(
        'Could not connect to the backend.',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        background: '#f8fafc',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '460px',
          background: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: '20px',
          padding: '32px',
          boxShadow:
            '0 20px 50px rgba(15, 23, 42, 0.08)',
        }}
      >

        <div
          style={{
            textAlign: 'center',
            marginBottom: '28px',
          }}
        >
          <div
            style={{
              width: '54px',
              height: '54px',
              margin: '0 auto 14px',
              borderRadius: '16px',
              background: '#eff6ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '26px',
            }}
          >
            🌐
          </div>

          <h1
            style={{
              margin: 0,
              color: '#111827',
              fontSize: '25px',
              fontWeight: 800,
            }}
          >
            Create your account
          </h1>

          <p
            style={{
              marginTop: '8px',
              color: '#6b7280',
              fontSize: '13px',
            }}
          >
            Join your local community
          </p>
        </div>

        <form onSubmit={handleRegister}>

          <label
            style={{
              display: 'block',
              marginBottom: '7px',
              color: '#374151',
              fontSize: '12px',
              fontWeight: 700,
            }}
          >
            Name
          </label>

          <input
            type="text"
            value={name}
            onChange={(event) =>
              setName(event.target.value)
            }
            placeholder="Enter your name"
            required
            style={inputStyle}
          />

          <label
            style={{
              display: 'block',
              marginBottom: '7px',
              color: '#374151',
              fontSize: '12px',
              fontWeight: 700,
            }}
          >
            Email
          </label>

          <input
            type="email"
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
            placeholder="Enter your email"
            required
            style={inputStyle}
          />

          <label
            style={{
              display: 'block',
              marginBottom: '7px',
              color: '#374151',
              fontSize: '12px',
              fontWeight: 700,
            }}
          >
            Password
          </label>

          <input
            type="password"
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
            placeholder="Create a password"
            required
            style={inputStyle}
          />

          <div
            style={{
              display: 'grid',
              gridTemplateColumns:
                '1fr 1fr',
              gap: '12px',
            }}
          >

            <div>
              <label
                style={{
                  display: 'block',
                  marginBottom: '7px',
                  color: '#374151',
                  fontSize: '12px',
                  fontWeight: 700,
                }}
              >
                Area
              </label>

              <input
                type="text"
                value={area}
                onChange={(event) =>
                  setArea(event.target.value)
                }
                placeholder="e.g. Madhapur"
                required
                style={inputStyle}
              />
            </div>

            <div>
              <label
                style={{
                  display: 'block',
                  marginBottom: '7px',
                  color: '#374151',
                  fontSize: '12px',
                  fontWeight: 700,
                }}
              >
                City
              </label>

              <input
                type="text"
                value={city}
                onChange={(event) =>
                  setCity(event.target.value)
                }
                placeholder="e.g. Hyderabad"
                required
                style={inputStyle}
              />
            </div>

          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              marginTop: '20px',
              padding: '13px',
              border: 'none',
              borderRadius: '10px',
              background: '#2563eb',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: 800,
              cursor: loading
                ? 'not-allowed'
                : 'pointer',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading
              ? 'Creating account...'
              : 'Create Account'}
          </button>

        </form>

        {message && (
          <div
            style={{
              marginTop: '16px',
              padding: '11px 13px',
              borderRadius: '10px',
              background: '#f8fafc',
              border: '1px solid #e5e7eb',
              color: '#374151',
              fontSize: '12px',
              lineHeight: 1.5,
            }}
          >
            {message}
          </div>
        )}

        <p
          style={{
            marginTop: '20px',
            textAlign: 'center',
            color: '#6b7280',
            fontSize: '12px',
          }}
        >
          Already have an account?{' '}

          <Link
            to="/login"
            style={{
              color: '#2563eb',
              fontWeight: 700,
              textDecoration: 'none',
            }}
          >
            Login
          </Link>
        </p>

      </div>
    </div>
  )
}

const inputStyle = {
  width: '100%',
  boxSizing: 'border-box',
  padding: '12px 13px',
  marginBottom: '16px',
  border: '1px solid #d1d5db',
  borderRadius: '10px',
  outline: 'none',
  fontSize: '13px',
  color: '#111827',
}

export default Register