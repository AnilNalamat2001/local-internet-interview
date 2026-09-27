import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import Home from './Home.jsx'
import Login from './Login.jsx'
import Register from './Register.jsx'
import PostDetails from './PostDetails.jsx'
import Profile from './Profile.jsx'

import './App.css'

function ProtectedRoute({ children }) {
  const loggedInUser = localStorage.getItem('loggedInUser')

  if (!loggedInUser) {
    return <Navigate to="/login" replace />
  }

  return children
}

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/posts/:id"
          element={
            <ProtectedRoute>
              <PostDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />

      </Routes>
    </BrowserRouter>
  )
}

export default App