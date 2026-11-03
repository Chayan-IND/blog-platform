import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../api.js';
import { useAuth } from '../AuthContext.jsx';

export default function PostDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');

  function load() {
    api(`/posts/${id}`)
      .then(setPost)
      .catch((e) => setError(e.message));
  }

  useEffect(load, [id]);

  async function addComment(e) {
    e.preventDefault();
    setError('');
    try {
      await api(`/posts/${id}/comments`, { method: 'POST', body: { content: comment } });
      setComment('');
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function deleteComment(commentId) {
    try {
      await api(`/comments/${commentId}`, { method: 'DELETE' });
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function deletePost() {
    if (!window.confirm('Delete this post?')) return;
    try {
      await api(`/posts/${id}`, { method: 'DELETE' });
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  }

  if (error && !post) return <p className="error">{error}</p>;
  if (!post) return <p>Loading...</p>;

  const isOwner = user && user.id === post.user_id;

  return (
    <div>
      <h1>{post.title}</h1>
      <p className="meta">
        by {post.author} on {new Date(post.created_at).toLocaleDateString()}
      </p>
      <div className="content">{post.content}</div>

      {isOwner && (
        <div className="actions">
          <Link to={`/edit/${post.id}`}>Edit</Link>
          <button className="danger" onClick={deletePost}>Delete</button>
        </div>
      )}

      <h2>Comments ({post.comments.length})</h2>
      {error && <p className="error">{error}</p>}
      {post.comments.map((c) => (
        <div className="comment" key={c.id}>
          <p className="meta">
            {c.author} · {new Date(c.created_at).toLocaleString()}
          </p>
          <p>{c.content}</p>
          {user && user.id === c.user_id && (
            <button className="danger small" onClick={() => deleteComment(c.id)}>
              Delete
            </button>
          )}
        </div>
      ))}

      {user ? (
        <form className="form" onSubmit={addComment}>
          <textarea
            placeholder="Write a comment..."
            rows={3}
            maxLength={1000}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          />
          <button type="submit">Add Comment</button>
        </form>
      ) : (
        <p>
          <Link to="/login">Login</Link> to comment.
        </p>
      )}
    </div>
  );
}
