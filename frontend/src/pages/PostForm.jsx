import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../api.js';

// Used for both "Write Post" (/new) and "Edit Post" (/edit/:id)
export default function PostForm() {
  const { id } = useParams();
  const editing = Boolean(id);
  const [form, setForm] = useState({ title: '', content: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (editing) {
      api(`/posts/${id}`)
        .then((p) => setForm({ title: p.title, content: p.content }))
        .catch((e) => setError(e.message));
    }
  }, [id, editing]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      if (editing) {
        await api(`/posts/${id}`, { method: 'PUT', body: form });
        navigate(`/posts/${id}`);
      } else {
        const data = await api('/posts', { method: 'POST', body: form });
        navigate(`/posts/${data.id}`);
      }
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h1>{editing ? 'Edit Post' : 'Write a Post'}</h1>
      {error && <p className="error">{error}</p>}
      <input
        placeholder="Title"
        maxLength={200}
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        required
      />
      <textarea
        placeholder="Write your post here..."
        rows={12}
        value={form.content}
        onChange={(e) => setForm({ ...form, content: e.target.value })}
        required
      />
      <button type="submit">{editing ? 'Save Changes' : 'Publish'}</button>
    </form>
  );
}
