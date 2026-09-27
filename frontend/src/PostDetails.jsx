import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'

function PostDetails() {
  const { id } = useParams()

  const [post, setPost] = useState(null)
  const [comments, setComments] = useState([])
  const [commentContent, setCommentContent] = useState('')
  const [replyContent, setReplyContent] = useState('')
  const [replyingTo, setReplyingTo] = useState(null)

  const [showReportForm, setShowReportForm] = useState(false)
  const [reportReason, setReportReason] = useState('')

  const [loading, setLoading] = useState(true)
  const [commentLoading, setCommentLoading] = useState(false)
  const [replyLoading, setReplyLoading] = useState(false)
  const [reportLoading, setReportLoading] = useState(false)

  const [message, setMessage] = useState('')

  const loggedInUser = JSON.parse(
    localStorage.getItem('loggedInUser'),
  )

  const loadPost = async () => {
    try {
      const response = await fetch(
        `http://localhost:8081/posts/${id}`,
      )

      if (!response.ok) {
        throw new Error('Failed to load post')
      }

      const data = await response.json()

      setPost(data)
    } catch (error) {
      console.error(error)
      setMessage('Could not load this post.')
    }
  }

  const loadComments = async () => {
    try {
      const response = await fetch(
        `http://localhost:8081/comments/post/${id}`,
      )

      if (!response.ok) {
        throw new Error('Failed to load comments')
      }

      const data = await response.json()

      setComments(data)
    } catch (error) {
      console.error(error)
      setMessage('Could not load comments.')
    }
  }

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      setMessage('')

      await Promise.all([
        loadPost(),
        loadComments(),
      ])

      setLoading(false)
    }

    loadData()
  }, [id])

  const createComment = async () => {
    if (!commentContent.trim()) {
      setMessage('Comment content is required')
      return
    }

    if (!loggedInUser) {
      setMessage('Please login before commenting.')
      return
    }

    setCommentLoading(true)
    setMessage('')

    try {
      const response = await fetch(
        'http://localhost:8081/comments',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            content: commentContent,
            userId: loggedInUser.id,
            postId: Number(id),
            parentCommentId: null,
          }),
        },
      )

      const data = await response.json()

      if (!response.ok) {
        if (data.content) {
          setMessage(data.content)
        } else {
          setMessage('Could not add your comment.')
        }

        return
      }

      setComments((currentComments) => [
        ...currentComments,
        data,
      ])

      setCommentContent('')
      setMessage('Comment added successfully.')
    } catch (error) {
      console.error(error)
      setMessage('Could not add your comment.')
    } finally {
      setCommentLoading(false)
    }
  }

  const createReply = async (parentCommentId) => {
    if (!replyContent.trim()) {
      setMessage('Reply content is required')
      return
    }

    if (!loggedInUser) {
      setMessage('Please login before replying.')
      return
    }

    setReplyLoading(true)
    setMessage('')

    try {
      const response = await fetch(
        'http://localhost:8081/comments',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            content: replyContent,
            userId: loggedInUser.id,
            postId: Number(id),
            parentCommentId: parentCommentId,
          }),
        },
      )

      const data = await response.json()

      if (!response.ok) {
        if (data.content) {
          setMessage(data.content)
        } else {
          setMessage('Could not add your reply.')
        }

        return
      }

      setComments((currentComments) => [
        ...currentComments,
        data,
      ])

      setReplyContent('')
      setReplyingTo(null)
      setMessage('Reply added successfully.')
    } catch (error) {
      console.error(error)
      setMessage('Could not add your reply.')
    } finally {
      setReplyLoading(false)
    }
  }

  const reportPost = async () => {
    if (!reportReason.trim()) {
      setMessage('Please select a report reason.')
      return
    }

    if (!loggedInUser) {
      setMessage('Please login before reporting.')
      return
    }

    setReportLoading(true)
    setMessage('')

    try {
      const response = await fetch(
        'http://localhost:8081/reports',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            reason: reportReason,
            userId: loggedInUser.id,
            postId: Number(id),
          }),
        },
      )

      const data = await response.json()

      if (!response.ok) {
        if (data.reason) {
          setMessage(data.reason)
        } else {
          setMessage('Could not report this post.')
        }

        return
      }

      setShowReportForm(false)
      setReportReason('')
      setMessage('Post reported successfully.')
    } catch (error) {
      console.error(error)
      setMessage('Could not report this post.')
    } finally {
      setReportLoading(false)
    }
  }

  if (loading) {
    return (
      <main className="main">
        <div className="details-page">
          <Link to="/" className="back-link">
            ← Back to Local Feed
          </Link>

          <div className="details-loading">
            <p>Loading post...</p>
          </div>
        </div>
      </main>
    )
  }

  if (!post) {
    return (
      <main className="main">
        <div className="details-page">
          <Link to="/" className="back-link">
            ← Back to Local Feed
          </Link>

          <div className="details-error">
            <h2>Post not found</h2>
            <p>
              {message || 'Could not load this post.'}
            </p>
          </div>
        </div>
      </main>
    )
  }

  const topLevelComments = comments.filter(
    (comment) => comment.parentCommentId === null,
  )

  return (
    <main className="main">
      <div className="details-page">

        <Link to="/" className="back-link">
          ← Back to Local Feed
        </Link>

        <article className="post-details-card">

          <div className="details-post-header">

            <div className="details-user">

              <div className="details-avatar">
                {post.userName
                  ? post.userName
                      .charAt(0)
                      .toUpperCase()
                  : 'U'}
              </div>

              <div>
                <strong>
                  {post.userName || 'Local User'}
                </strong>

                <span>
                  📍 {post.location || 'Local Area'}
                </span>
              </div>

            </div>

            <span className="category">
              {post.category}
            </span>

          </div>

          <p className="details-post-content">
            {post.content}
          </p>

          <div className="details-ai-section">

            <div className="details-ai-title">
              🤖 AI Understanding
            </div>

            <div className="details-ai-grid">

              <div className="details-ai-item">
                <span>Topic</span>
                <strong>
                  {post.topic || 'GENERAL'}
                </strong>
              </div>

              <div className="details-ai-item">
                <span>Urgency</span>
                <strong>
                  {post.urgency || 'LOW'}
                </strong>
              </div>

              <div className="details-ai-item">
                <span>Location</span>
                <strong>
                  {post.location || 'Unknown'}
                </strong>
              </div>

            </div>

          </div>

          <div className="details-post-footer">

            <small>
              {new Date(
                post.createdAt,
              ).toLocaleString()}
            </small>

            <div className="report-section">

              {!showReportForm ? (

                <button
                  type="button"
                  className="report-button"
                  onClick={() => {
                    setShowReportForm(true)
                    setMessage('')
                  }}
                >
                  Report Post
                </button>

              ) : (

                <div className="report-form">

                  <label htmlFor="report-reason">
                    Why are you reporting this post?
                  </label>

                  <select
                    id="report-reason"
                    value={reportReason}
                    onChange={(event) =>
                      setReportReason(
                        event.target.value,
                      )
                    }
                  >
                    <option value="">
                      Select a reason
                    </option>

                    <option value="Spam">
                      Spam
                    </option>

                    <option value="Harassment">
                      Harassment
                    </option>

                    <option value="False information">
                      False information
                    </option>

                    <option value="Inappropriate content">
                      Inappropriate content
                    </option>

                    <option value="Other">
                      Other
                    </option>
                  </select>

                  <div className="report-actions">

                    <button
                      type="button"
                      onClick={reportPost}
                      disabled={reportLoading}
                    >
                      {reportLoading
                        ? 'Reporting...'
                        : 'Submit Report'}
                    </button>

                    <button
                      type="button"
                      className="cancel-button"
                      onClick={() => {
                        setShowReportForm(false)
                        setReportReason('')
                        setMessage('')
                      }}
                    >
                      Cancel
                    </button>

                  </div>

                </div>

              )}

            </div>

          </div>

        </article>

        {message && (
          <div className="details-message">
            {message}
          </div>
        )}

        <section className="comments-section">

          <div className="comments-heading">
            <div>
              <h2>Community Discussion</h2>

              <p>
                {comments.length === 0
                  ? 'Start the conversation.'
                  : `${comments.length} ${
                      comments.length === 1
                        ? 'comment'
                        : 'comments'
                    }`}
              </p>
            </div>
          </div>

          <div className="comment-form">

            <textarea
              value={commentContent}
              onChange={(event) =>
                setCommentContent(
                  event.target.value,
                )
              }
              placeholder={
                loggedInUser
                  ? 'Share your thoughts...'
                  : 'Login to comment...'
              }
              rows="4"
              disabled={!loggedInUser}
            />

            <button
              type="button"
              onClick={createComment}
              disabled={
                commentLoading ||
                !loggedInUser
              }
            >
              {commentLoading
                ? 'Adding...'
                : 'Add Comment'}
            </button>

          </div>

          <div className="comments-list">

            {topLevelComments.length === 0 ? (

              <div className="no-comments">
                <div>💬</div>

                <h3>
                  No comments yet
                </h3>

                <p>
                  Be the first person to
                  join the discussion.
                </p>
              </div>

            ) : (

              topLevelComments.map(
                (comment) => {

                  const replies =
                    comments.filter(
                      (reply) =>
                        reply.parentCommentId ===
                        comment.id,
                    )

                  return (
                    <div
                      key={comment.id}
                      className="comment-thread"
                    >

                      <article className="comment-card">

                        <div className="comment-header">

                          <div className="comment-user">

                            <div className="comment-avatar">
                              {comment.userName
                                ? comment.userName
                                    .charAt(0)
                                    .toUpperCase()
                                : 'U'}
                            </div>

                            <div>
                              <strong>
                                {comment.userName ||
                                  'Local User'}
                              </strong>

                              <small>
                                {new Date(
                                  comment.createdAt,
                                ).toLocaleString()}
                              </small>
                            </div>

                          </div>

                        </div>

                        <p>
                          {comment.content}
                        </p>

                        <button
                          type="button"
                          className="reply-button"
                          onClick={() => {
                            setReplyingTo(
                              comment.id,
                            )
                            setReplyContent('')
                            setMessage('')
                          }}
                        >
                          ↩ Reply
                        </button>

                        {replyingTo ===
                          comment.id && (

                          <div className="reply-form">

                            <textarea
                              value={replyContent}
                              onChange={(event) =>
                                setReplyContent(
                                  event.target.value,
                                )
                              }
                              placeholder="Write a reply..."
                              rows="3"
                            />

                            <div className="reply-actions">

                              <button
                                type="button"
                                onClick={() =>
                                  createReply(
                                    comment.id,
                                  )
                                }
                                disabled={replyLoading}
                              >
                                {replyLoading
                                  ? 'Replying...'
                                  : 'Add Reply'}
                              </button>

                              <button
                                type="button"
                                className="cancel-button"
                                onClick={() => {
                                  setReplyingTo(null)
                                  setReplyContent('')
                                  setMessage('')
                                }}
                              >
                                Cancel
                              </button>

                            </div>

                          </div>
                        )}

                      </article>

                      {replies.length > 0 && (

                        <div className="replies">

                          {replies.map(
                            (reply) => (

                              <article
                                className="comment-card reply-card"
                                key={reply.id}
                              >

                                <div className="comment-header">

                                  <div className="comment-user">

                                    <div className="comment-avatar">
                                      {reply.userName
                                        ? reply.userName
                                            .charAt(0)
                                            .toUpperCase()
                                        : 'U'}
                                    </div>

                                    <div>
                                      <strong>
                                        {reply.userName ||
                                          'Local User'}
                                      </strong>

                                      <small>
                                        {new Date(
                                          reply.createdAt,
                                        ).toLocaleString()}
                                      </small>
                                    </div>

                                  </div>

                                </div>

                                <p>
                                  {reply.content}
                                </p>

                              </article>

                            ),
                          )}

                        </div>

                      )}

                    </div>
                  )
                },
              )

            )}

          </div>

        </section>

      </div>
    </main>
  )
}

export default PostDetails