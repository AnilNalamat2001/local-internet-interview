import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Home() {
  const navigate = useNavigate()

  const [posts, setPosts] = useState([])
  const [content, setContent] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('ALL')

  const [searchKeyword, setSearchKeyword] = useState('')
  const [searchLoading, setSearchLoading] = useState(false)

  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [message, setMessage] = useState('')

  const [drawerOpen, setDrawerOpen] = useState(false)

  const [aiChatOpen, setAiChatOpen] = useState(false)
  const [aiChatMessage, setAiChatMessage] = useState('')
  const [aiChatReply, setAiChatReply] = useState('')
  const [aiChatLoading, setAiChatLoading] = useState(false)

  const loggedInUser = JSON.parse(
    localStorage.getItem('loggedInUser'),
  )

  const loadPosts = async () => {
    setLoading(true)

    try {
      const response = await fetch(
        'http://localhost:8081/posts',
      )

      if (!response.ok) {
        throw new Error('Failed to load posts')
      }

      const data = await response.json()

      setPosts(data)
    } catch (error) {
      console.error(error)
      setMessage('Could not load local posts.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPosts()
  }, [])

  const createPost = async () => {
    if (!content.trim()) {
      setMessage('Post content is required')
      return
    }

    if (!loggedInUser) {
      navigate('/login')
      return
    }

    setCreating(true)
    setMessage('')

    try {
      const response = await fetch(
        'http://localhost:8081/posts',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            content: content,
            userId: loggedInUser.id,
          }),
        },
      )

      const data = await response.json()

      if (!response.ok) {
        setMessage(
          data.content ||
          'Could not create your post.',
        )

        return
      }

      setPosts((currentPosts) => [
        data,
        ...currentPosts,
      ])

      setContent('')
      setMessage('Post created successfully.')
      setSelectedFilter('ALL')
    } catch (error) {
      console.error(error)
      setMessage('Could not create your post.')
    } finally {
      setCreating(false)
    }
  }

  const searchPosts = async () => {
    if (!searchKeyword.trim()) {
      loadPosts()
      return
    }

    setSearchLoading(true)
    setMessage('')

    try {
      const response = await fetch(
        `http://localhost:8081/posts/search?keyword=${encodeURIComponent(
          searchKeyword,
        )}`,
      )

      if (!response.ok) {
        throw new Error('Search failed')
      }

      const data = await response.json()

      setPosts(data)
      setSelectedFilter('ALL')
    } catch (error) {
      console.error(error)
      setMessage('Could not search posts.')
    } finally {
      setSearchLoading(false)
    }
  }

  const clearSearch = async () => {
    setSearchKeyword('')
    setMessage('')
    await loadPosts()
  }

  const handleSearchKeyDown = (event) => {
    if (event.key === 'Enter') {
      searchPosts()
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('loggedInUser')
    navigate('/login')
  }

  const openAiChat = (initialMessage = '') => {
    setAiChatOpen(true)
    setAiChatReply('')

    if (initialMessage) {
      setAiChatMessage(initialMessage)
    }
  }

  const closeAiChat = () => {
    setAiChatOpen(false)
  }

  const askAi = async () => {
    if (!aiChatMessage.trim()) {
      return
    }

    if (!loggedInUser) {
      navigate('/login')
      return
    }

    setAiChatLoading(true)
    setAiChatReply('')

    try {
      const response = await fetch(
        'http://localhost:8081/ai/chat',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: aiChatMessage,
            userId: loggedInUser.id,
          }),
        },
      )

      const data = await response.json()

      if (!response.ok) {
        setAiChatReply(
          data.message ||
          'The Local AI Assistant could not process your request.',
        )

        return
      }

      setAiChatReply(data.reply)
    } catch (error) {
      console.error(error)

      setAiChatReply(
        'Could not connect to the Local AI Assistant.',
      )
    } finally {
      setAiChatLoading(false)
    }
  }

  const handleAiKeyDown = (event) => {
    if (
      event.key === 'Enter' &&
      !event.shiftKey
    ) {
      event.preventDefault()
      askAi()
    }
  }

  const closeDrawer = () => {
    setDrawerOpen(false)
  }

  const handleDrawerAction = (action) => {
    closeDrawer()

    if (action === 'home') {
      setSelectedFilter('ALL')

      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      })

      return
    }

    if (action === 'discover') {
      setMessage(
        'Discover feature will be added next.',
      )
      return
    }

    if (action === 'saved') {
      setMessage(
        'Saved posts will be added next.',
      )
      return
    }

    if (action === 'ai') {
      openAiChat()
      return
    }

    if (action === 'events') {
      setSelectedFilter('EVENT')
      return
    }

    if (action === 'jobs') {
      setMessage(
        'Local Jobs feature will be added next.',
      )
      return
    }

    if (action === 'alerts') {
      setSelectedFilter('LOCAL_UPDATE')
      return
    }

    if (action === 'vehicles') {
      setMessage(
        'Vehicles & Roads intelligence will be expanded next.',
      )
      return
    }

    if (action === 'settings') {
      navigate('/profile')
    }
  }

  const getUrgencyStyle = (urgency) => {
    if (urgency === 'HIGH') {
      return {
        background: '#fef2f2',
        border: '#fecaca',
        text: '#b91c1c',
        accent: '#ef4444',
        label: '🚨 HIGH',
      }
    }

    if (urgency === 'MEDIUM') {
      return {
        background: '#fff7ed',
        border: '#fed7aa',
        text: '#c2410c',
        accent: '#f97316',
        label: '🟠 MEDIUM',
      }
    }

    return {
      background: '#f0fdf4',
      border: '#bbf7d0',
      text: '#15803d',
      accent: '#22c55e',
      label: '🟢 LOW',
    }
  }

  const filteredPosts =
    selectedFilter === 'ALL'
      ? posts
      : posts.filter(
          (post) => post.category === selectedFilter,
        )

  return (
    <div className="modern-app">

      <style>
        {`
          .local-post-card {
            background: #ffffff;
            border: 1px solid #e5e7eb;
            border-radius: 18px;
            padding: 20px;
            margin-bottom: 16px;
            box-shadow: 0 5px 20px rgba(15, 23, 42, 0.05);
            transition: transform 0.2s ease, box-shadow 0.2s ease;
          }

          .local-post-card:hover {
            transform: translateY(-1px);
            box-shadow: 0 10px 28px rgba(15, 23, 42, 0.08);
          }

          .local-post-top {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            gap: 15px;
          }

          .local-post-user {
            display: flex;
            align-items: center;
            gap: 11px;
            min-width: 0;
          }

          .local-post-avatar {
            width: 43px;
            height: 43px;
            min-width: 43px;
            border-radius: 50%;
            background: linear-gradient(
              135deg,
              #2563eb,
              #7c3aed
            );
            color: #ffffff;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 17px;
            font-weight: 800;
          }

          .local-post-user-info {
            min-width: 0;
          }

          .local-post-user-name {
            display: block;
            color: #111827;
            font-size: 14px;
            font-weight: 800;
          }

          .local-post-meta {
            display: block;
            margin-top: 4px;
            color: #9ca3af;
            font-size: 11px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .local-urgency {
            flex-shrink: 0;
            padding: 7px 11px;
            border-radius: 999px;
            font-size: 10px;
            font-weight: 800;
            letter-spacing: 0.3px;
          }

          .local-post-content {
            margin: 18px 2px 20px;
            color: #1f2937;
            font-size: 16px;
            line-height: 1.7;
            font-weight: 500;
          }

          .local-post-high-content {
            font-weight: 700;
          }

          .local-ai-section {
            border-top: 1px solid #e5e7eb;
            padding-top: 15px;
          }

          .local-ai-title {
            display: flex;
            align-items: center;
            gap: 7px;
            margin-bottom: 13px;
            color: #374151;
            font-size: 12px;
            font-weight: 800;
          }

          .local-ai-title span {
            color: #2563eb;
          }

          .local-ai-grid {
            display: grid;
            grid-template-columns: repeat(4, minmax(0, 1fr));
            border: 1px solid #e5e7eb;
            border-radius: 12px;
            overflow: hidden;
            background: #f8fafc;
          }

          .local-ai-item {
            padding: 11px 12px;
            min-width: 0;
          }

          .local-ai-item + .local-ai-item {
            border-left: 1px solid #e5e7eb;
          }

          .local-ai-label {
            display: block;
            color: #9ca3af;
            font-size: 9px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.4px;
          }

          .local-ai-value {
            display: block;
            margin-top: 5px;
            color: #111827;
            font-size: 11px;
            font-weight: 800;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .local-ai-urgency {
            font-weight: 900;
          }

          .local-post-actions {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-top: 16px;
            padding-top: 14px;
            border-top: 1px solid #f1f5f9;
          }

          .local-post-actions button,
          .local-post-actions a {
            border: none;
            background: transparent;
            color: #6b7280;
            font-size: 11px;
            font-weight: 700;
            text-decoration: none;
            cursor: pointer;
            padding: 7px 8px;
            border-radius: 7px;
          }

          .local-post-actions button:hover,
          .local-post-actions a:hover {
            background: #f8fafc;
            color: #2563eb;
          }

          .local-view-post {
            color: #2563eb !important;
          }

          .local-post-more {
            margin-left: auto;
          }

          .local-ai-chat-overlay {
            position: fixed;
            inset: 0;
            z-index: 3000;
            background: rgba(15, 23, 42, 0.48);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
          }

          .local-ai-chat {
            width: 100%;
            max-width: 620px;
            background: #ffffff;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 25px 70px rgba(15, 23, 42, 0.25);
          }

          .local-ai-chat-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 17px 20px;
            border-bottom: 1px solid #e5e7eb;
          }

          .local-ai-chat-brand {
            display: flex;
            align-items: center;
            gap: 11px;
          }

          .local-ai-chat-icon {
            width: 42px;
            height: 42px;
            border-radius: 12px;
            background: #eff6ff;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
          }

          .local-ai-chat-brand strong {
            display: block;
            color: #111827;
            font-size: 14px;
          }

          .local-ai-chat-brand span {
            display: block;
            margin-top: 3px;
            color: #9ca3af;
            font-size: 10px;
          }

          .local-ai-close {
            width: 35px;
            height: 35px;
            border: none;
            border-radius: 50%;
            background: #f3f4f6;
            color: #374151;
            font-size: 19px;
            cursor: pointer;
          }

          .local-ai-chat-body {
            min-height: 190px;
            max-height: 430px;
            overflow-y: auto;
            padding: 20px;
          }

          .local-ai-reply {
            padding: 14px;
            border-radius: 14px;
            background: #f8fafc;
            color: #374151;
            font-size: 13px;
            line-height: 1.7;
            white-space: pre-line;
          }

          .local-ai-chat-footer {
            padding: 15px 20px 18px;
            border-top: 1px solid #e5e7eb;
          }

          .local-ai-input-row {
            display: flex;
            gap: 8px;
          }

          .local-ai-input {
            flex: 1;
            min-width: 0;
            padding: 12px 13px;
            border: 1px solid #d1d5db;
            border-radius: 10px;
            outline: none;
            font-size: 13px;
          }

          .local-ai-input:focus {
            border-color: #2563eb;
          }

          .local-ai-send {
            border: none;
            border-radius: 10px;
            padding: 0 18px;
            background: #2563eb;
            color: white;
            font-weight: 800;
            cursor: pointer;
          }

          .local-ai-send:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }

          .local-ai-hint {
            margin-top: 7px;
            color: #9ca3af;
            font-size: 9px;
          }

          .clickable-header-user {
            border: none;
            background: transparent;
            padding: 5px 7px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            gap: 9px;
            cursor: pointer;
            text-align: left;
          }

          .clickable-header-user:hover {
            background: #f8fafc;
          }

          @media (max-width: 700px) {
            .local-post-card {
              padding: 16px;
              border-radius: 15px;
            }

            .local-post-top {
              gap: 8px;
            }

            .local-urgency {
              font-size: 9px;
              padding: 6px 8px;
            }

            .local-ai-grid {
              grid-template-columns: 1fr 1fr;
            }

            .local-ai-item:nth-child(3) {
              border-left: none;
              border-top: 1px solid #e5e7eb;
            }

            .local-ai-item:nth-child(4) {
              border-top: 1px solid #e5e7eb;
            }

            .local-post-actions {
              flex-wrap: wrap;
            }
          }

          @media (max-width: 430px) {
            .local-post-meta {
              max-width: 170px;
            }

            .local-post-content {
              font-size: 14px;
            }

            .local-ai-grid {
              grid-template-columns: 1fr;
            }

            .local-ai-item + .local-ai-item {
              border-left: none;
              border-top: 1px solid #e5e7eb;
            }

            .local-ai-item:nth-child(3) {
              border-top: 1px solid #e5e7eb;
            }
          }
        `}
      </style>

      <header className="modern-header">

        <div className="modern-header-left">

          <button
            type="button"
            className="menu-button"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open menu"
          >
            ☰
          </button>

          <div className="modern-brand">

            <div className="modern-brand-icon">
              🌐
            </div>

            <div>
              <h1>Local Internet</h1>

              <span>
                Intelligent local community
              </span>
            </div>

          </div>

        </div>

        <div className="modern-header-search">

          <span>🔎</span>

          <input
            type="text"
            value={searchKeyword}
            onChange={(event) =>
              setSearchKeyword(event.target.value)
            }
            onKeyDown={handleSearchKeyDown}
            placeholder="Search your local community..."
          />

          {searchKeyword && (
            <button
              type="button"
              onClick={clearSearch}
              aria-label="Clear search"
            >
              ×
            </button>
          )}

        </div>

        <div className="modern-header-actions">

          <button
            type="button"
            className="header-ai-button"
            onClick={() => openAiChat()}
          >
            🤖 Ask AI
          </button>

          <button
            type="button"
            className="header-icon-button"
            onClick={() =>
              setMessage(
                'Notifications will be added next.',
              )
            }
            aria-label="Notifications"
          >
            🔔
          </button>

          <button
            type="button"
            className="header-user clickable-header-user"
            onClick={() => navigate('/profile')}
            aria-label="Open profile"
          >

            <div className="profile-avatar">
              {loggedInUser?.name
                ? loggedInUser.name
                    .charAt(0)
                    .toUpperCase()
                : 'U'}
            </div>

            <div className="header-user-info">

              <strong>
                {loggedInUser?.name || 'User'}
              </strong>

              <span>
                📍 {loggedInUser?.area || 'Local Area'}
              </span>

            </div>

          </button>

        </div>

      </header>

      {drawerOpen && (
        <div
          className="menu-overlay"
          onClick={closeDrawer}
        />
      )}

      <aside
        className={
          drawerOpen
            ? 'drawer-sidebar drawer-sidebar-open'
            : 'drawer-sidebar'
        }
      >

        <div className="drawer-header">

          <div className="modern-brand">

            <div className="modern-brand-icon">
              🌐
            </div>

            <div>
              <h1>Local Internet</h1>

              <span>
                Intelligent local community
              </span>
            </div>

          </div>

          <button
            type="button"
            className="drawer-close-button"
            onClick={closeDrawer}
          >
            ×
          </button>

        </div>

        <div className="drawer-profile">

          <div className="large-profile-avatar">
            {loggedInUser?.name
              ? loggedInUser.name
                  .charAt(0)
                  .toUpperCase()
              : 'U'}
          </div>

          <div>

            <strong>
              {loggedInUser?.name || 'User'}
            </strong>

            <span>
              📍 {loggedInUser?.area || 'Local Area'}
            </span>

          </div>

        </div>

        <nav className="drawer-nav">

          <button
            type="button"
            className="drawer-link active"
            onClick={() =>
              handleDrawerAction('home')
            }
          >
            🏠
            <span>Home</span>
          </button>

          <button
            type="button"
            className="drawer-link"
            onClick={() =>
              handleDrawerAction('discover')
            }
          >
            🔥
            <span>Discover</span>
          </button>

          <button
            type="button"
            className="drawer-link"
            onClick={() =>
              handleDrawerAction('saved')
            }
          >
            📌
            <span>Saved</span>
          </button>

          <button
            type="button"
            className="drawer-link"
            onClick={() =>
              handleDrawerAction('ai')
            }
          >
            🤖
            <span>Local AI</span>
          </button>

          <button
            type="button"
            className="drawer-link"
            onClick={() =>
              handleDrawerAction('events')
            }
          >
            🎉
            <span>Events</span>
          </button>

          <button
            type="button"
            className="drawer-link"
            onClick={() =>
              handleDrawerAction('jobs')
            }
          >
            💼
            <span>Local Jobs</span>
          </button>

          <button
            type="button"
            className="drawer-link"
            onClick={() =>
              handleDrawerAction('alerts')
            }
          >
            🚨
            <span>Local Alerts</span>
          </button>

          <button
            type="button"
            className="drawer-link"
            onClick={() =>
              handleDrawerAction('vehicles')
            }
          >
            🚗
            <span>Vehicles & Roads</span>
          </button>

        </nav>

        <div className="drawer-bottom">

          <button
            type="button"
            className="drawer-link"
            onClick={() =>
              handleDrawerAction('settings')
            }
          >
            ⚙️
            <span>Profile</span>
          </button>

          <button
            type="button"
            className="drawer-link logout-link"
            onClick={handleLogout}
          >
            🚪
            <span>Logout</span>
          </button>

        </div>

      </aside>

      <div className="dashboard-layout">

        <main className="dashboard-main">

          <section className="dashboard-welcome">

            <div>

              <span className="dashboard-label">
                📍 YOUR LOCAL COMMUNITY
              </span>

              <h2>
                What's happening around you?
              </h2>

              <p>
                Discover useful information from
                people around your local area.
              </p>

            </div>

          </section>

          <section className="modern-create-post">

            <div className="create-post-user">

              <div className="small-profile-avatar">
                {loggedInUser?.name
                  ? loggedInUser.name
                      .charAt(0)
                      .toUpperCase()
                  : 'U'}
              </div>

              <div>

                <strong>
                  {loggedInUser?.name || 'User'}
                </strong>

                <span>
                  Share something with your community
                </span>

              </div>

            </div>

            <textarea
              value={content}
              onChange={(event) =>
                setContent(event.target.value)
              }
              placeholder="What's happening around you?"
              rows="4"
            />

            <div className="create-post-bottom">

              <div className="create-post-tools">

                <button
                  type="button"
                  onClick={() =>
                    setMessage(
                      'Image attachments will be added next.',
                    )
                  }
                >
                  🖼️ Photo
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setMessage(
                      'Location sharing will be added next.',
                    )
                  }
                >
                  📍 Location
                </button>

                <button
                  type="button"
                  onClick={() =>
                    openAiChat()
                  }
                >
                  🤖 Ask AI
                </button>

              </div>

              <button
                type="button"
                className="create-post-button"
                onClick={createPost}
                disabled={creating}
              >
                {creating
                  ? 'Posting...'
                  : 'Create Post'}
              </button>

            </div>

            {message && (
              <p className="dashboard-message">
                {message}
              </p>
            )}

          </section>

          <section className="feed-search">

            <div className="feed-search-input">

              <span>🔎</span>

              <input
                type="text"
                value={searchKeyword}
                onChange={(event) =>
                  setSearchKeyword(event.target.value)
                }
                onKeyDown={handleSearchKeyDown}
                placeholder="Search local posts..."
              />

            </div>

            <button
              type="button"
              onClick={searchPosts}
              disabled={searchLoading}
            >
              {searchLoading
                ? 'Searching...'
                : 'Search'}
            </button>

          </section>

          <section className="category-row">

            <button
              type="button"
              className={
                selectedFilter === 'ALL'
                  ? 'category-button active'
                  : 'category-button'
              }
              onClick={() =>
                setSelectedFilter('ALL')
              }
            >
              🌐 All
            </button>

            <button
              type="button"
              className={
                selectedFilter === 'ASK'
                  ? 'category-button active'
                  : 'category-button'
              }
              onClick={() =>
                setSelectedFilter('ASK')
              }
            >
              💬 Ask
            </button>

            <button
              type="button"
              className={
                selectedFilter === 'NEED'
                  ? 'category-button active'
                  : 'category-button'
              }
              onClick={() =>
                setSelectedFilter('NEED')
              }
            >
              🙋 Need
            </button>

            <button
              type="button"
              className={
                selectedFilter === 'OFFER'
                  ? 'category-button active'
                  : 'category-button'
              }
              onClick={() =>
                setSelectedFilter('OFFER')
              }
            >
              🤝 Offer
            </button>

            <button
              type="button"
              className={
                selectedFilter === 'EVENT'
                  ? 'category-button active'
                  : 'category-button'
              }
              onClick={() =>
                setSelectedFilter('EVENT')
              }
            >
              🎉 Events
            </button>

            <button
              type="button"
              className={
                selectedFilter === 'LOCAL_UPDATE'
                  ? 'category-button active'
                  : 'category-button'
              }
              onClick={() =>
                setSelectedFilter('LOCAL_UPDATE')
              }
            >
              🚨 Alerts
            </button>

          </section>

          <section className="modern-feed">

            <div className="feed-title-row">

              <div>

                <h2>
                  Local Feed
                </h2>

                <span>
                  AI-organized community information
                </span>

              </div>

              <span className="live-badge">
                ● LIVE
              </span>

            </div>

            {loading ? (
              <div className="empty-feed">

                <span>
                  ⏳
                </span>

                <p>
                  Loading local community...
                </p>

              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="empty-feed">

                <span>
                  📭
                </span>

                <p>
                  No local posts found.
                </p>

              </div>
            ) : (
              filteredPosts.map((post) => {

                const urgency =
                  getUrgencyStyle(post.urgency)

                const userInitial =
                  post.userName
                    ? post.userName
                        .charAt(0)
                        .toUpperCase()
                    : 'U'

                return (
                  <article
                    key={post.id}
                    className="local-post-card"
                    style={{
                      borderLeft:
                        `4px solid ${urgency.accent}`,
                    }}
                  >

                    <div className="local-post-top">

                      <div className="local-post-user">

                        <div className="local-post-avatar">
                          {userInitial}
                        </div>

                        <div className="local-post-user-info">

                          <span className="local-post-user-name">
                            {post.userName || 'User'}
                          </span>

                          <span className="local-post-meta">
                            📍 {post.location || 'Local Area'}
                            {' · '}
                            {new Date(
                              post.createdAt,
                            ).toLocaleString()}
                          </span>

                        </div>

                      </div>

                      <span
                        className="local-urgency"
                        style={{
                          background:
                            urgency.background,
                          border:
                            `1px solid ${urgency.border}`,
                          color:
                            urgency.text,
                        }}
                      >
                        {urgency.label}
                      </span>

                    </div>

                    <p
                      className={
                        post.urgency === 'HIGH'
                          ? 'local-post-content local-post-high-content'
                          : 'local-post-content'
                      }
                    >
                      {post.content}
                    </p>

                    <div className="local-ai-section">

                      <div className="local-ai-title">

                        <span>
                          🤖
                        </span>

                        <span>
                          AI Understanding
                        </span>

                      </div>

                      <div className="local-ai-grid">

                        <div className="local-ai-item">

                          <span className="local-ai-label">
                            🎯 Intent
                          </span>

                          <strong className="local-ai-value">
                            {post.category}
                          </strong>

                        </div>

                        <div className="local-ai-item">

                          <span className="local-ai-label">
                            🔎 Topic
                          </span>

                          <strong className="local-ai-value">
                            {post.topic || 'GENERAL'}
                          </strong>

                        </div>

                        <div className="local-ai-item">

                          <span className="local-ai-label">
                            📍 Location
                          </span>

                          <strong className="local-ai-value">
                            {post.location || 'Unknown'}
                          </strong>

                        </div>

                        <div className="local-ai-item">

                          <span className="local-ai-label">
                            ⚡ Urgency
                          </span>

                          <strong
                            className="local-ai-value local-ai-urgency"
                            style={{
                              color:
                                urgency.text,
                            }}
                          >
                            {post.urgency || 'LOW'}
                          </strong>

                        </div>

                      </div>

                    </div>

                    <div className="local-post-actions">

                      <Link
                        to={`/posts/${post.id}`}
                        className="local-view-post"
                      >
                        💬 View Post & Comments
                      </Link>

                      <button
                        type="button"
                        onClick={() =>
                          setMessage(
                            'Share feature will be added next.',
                          )
                        }
                      >
                        ↗ Share
                      </button>

                      <button
                        type="button"
                        className="local-post-more"
                        onClick={() =>
                          setMessage(
                            'Post actions available inside post details.',
                          )
                        }
                      >
                        •••
                      </button>

                    </div>

                  </article>
                )
              })
            )}

          </section>

        </main>

        <aside className="right-sidebar">

          <section className="ai-assistant-card">

            <div className="ai-assistant-header">

              <div className="ai-assistant-icon">
                🤖
              </div>

              <div>

                <strong>
                  Local AI Assistant
                </strong>

                <span>
                  Intelligent community assistant
                </span>

              </div>

              <span className="ai-online">
                ●
              </span>

            </div>

            <div className="ai-assistant-message">

              <strong>
                How can I help?
              </strong>

              <p>
                Ask about what's happening,
                people, events or useful information
                around your local area.
              </p>

            </div>

            <div className="ai-suggestions">

              <button
                type="button"
                onClick={() =>
                  openAiChat(
                    "What's happening near me?",
                  )
                }
              >
                📍 What's happening near me?
              </button>

              <button
                type="button"
                onClick={() =>
                  openAiChat(
                    'Any vehicle help nearby?',
                  )
                }
              >
                🚗 Any vehicle help nearby?
              </button>

              <button
                type="button"
                onClick={() =>
                  openAiChat(
                    'Events happening today?',
                  )
                }
              >
                🎉 Events happening today?
              </button>

              <button
                type="button"
                onClick={() =>
                  openAiChat(
                    'Any local opportunities?',
                  )
                }
              >
                💼 Any local opportunities?
              </button>

            </div>

            <button
              type="button"
              className="open-ai-button"
              onClick={() =>
                openAiChat()
              }
            >
              Open Local AI →
            </button>

          </section>

          <section className="right-info-card">

            <div className="right-card-title">

              <strong>
                🚨 Local Intelligence
              </strong>

              <span>
                AI
              </span>

            </div>

            <div className="right-info-item">

              <span>
                🚗
              </span>

              <div>

                <strong>
                  Vehicle & Roads
                </strong>

                <small>
                  Local vehicle-related posts
                </small>

              </div>

            </div>

            <div className="right-info-item">

              <span>
                💼
              </span>

              <div>

                <strong>
                  Jobs & Opportunities
                </strong>

                <small>
                  Local work information
                </small>

              </div>

            </div>

            <div className="right-info-item">

              <span>
                🎉
              </span>

              <div>

                <strong>
                  Events
                </strong>

                <small>
                  Community activities
                </small>

              </div>

            </div>

            <div className="right-info-item">

              <span>
                📍
              </span>

              <div>

                <strong>
                  Nearby Activity
                </strong>

                <small>
                  Information around your area
                </small>

              </div>

            </div>

          </section>

          <section className="right-info-card">

            <div className="right-card-title">

              <strong>
                🧠 AI Capabilities
              </strong>

            </div>

            <div className="capability-list">

              <span>
                ✓ Intent Detection
              </span>

              <span>
                ✓ Topic Classification
              </span>

              <span>
                ✓ Location Extraction
              </span>

              <span>
                ✓ Urgency Detection
              </span>

              <span>
                ✓ Smart Local Search
              </span>

            </div>

          </section>

        </aside>

      </div>

      {aiChatOpen && (

        <div
          className="local-ai-chat-overlay"
          onClick={closeAiChat}
        >

          <div
            className="local-ai-chat"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className="local-ai-chat-header">

              <div className="local-ai-chat-brand">

                <div className="local-ai-chat-icon">
                  🤖
                </div>

                <div>

                  <strong>
                    Local AI Assistant
                  </strong>

                  <span>
                    Search your local community
                  </span>

                </div>

              </div>

              <button
                type="button"
                className="local-ai-close"
                onClick={closeAiChat}
              >
                ×
              </button>

            </div>

            <div className="local-ai-chat-body">

              <div className="local-ai-reply">

                {aiChatReply ||
                  'Ask me about your local community. I can search local posts for nearby activity, vehicles, jobs and more.'}

              </div>

            </div>

            <div className="local-ai-chat-footer">

              <div className="local-ai-input-row">

                <input
                  className="local-ai-input"
                  type="text"
                  value={aiChatMessage}
                  onChange={(event) =>
                    setAiChatMessage(
                      event.target.value,
                    )
                  }
                  onKeyDown={handleAiKeyDown}
                  placeholder="Ask something about your local area..."
                />

                <button
                  type="button"
                  className="local-ai-send"
                  onClick={askAi}
                  disabled={aiChatLoading}
                >
                  {aiChatLoading
                    ? '...'
                    : 'Ask'}
                </button>

              </div>

              <div className="local-ai-hint">
                Press Enter to ask
              </div>

            </div>

          </div>

        </div>

      )}

    </div>
  )
}

export default Home