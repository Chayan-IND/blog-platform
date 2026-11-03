const express = require('express');
const db = require('../db');
const auth = require('../middleware/auth');

const router = express.Router();

// GET /api/posts  -> all posts (public)
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT p.id, p.title, LEFT(p.content, 200) AS excerpt, p.created_at,
              u.username AS author, p.user_id,
              (SELECT COUNT(*) FROM comments c WHERE c.post_id = p.id) AS comment_count
       FROM posts p JOIN users u ON u.id = p.user_id
       ORDER BY p.created_at DESC`
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/posts/:id  -> one post with its comments (public)
router.get('/:id', async (req, res) => {
  try {
    const [posts] = await db.query(
      `SELECT p.id, p.title, p.content, p.created_at, p.updated_at,
              u.username AS author, p.user_id
       FROM posts p JOIN users u ON u.id = p.user_id
       WHERE p.id = ?`,
      [req.params.id]
    );
    if (posts.length === 0) return res.status(404).json({ message: 'Post not found' });

    const [comments] = await db.query(
      `SELECT c.id, c.content, c.created_at, c.user_id, u.username AS author
       FROM comments c JOIN users u ON u.id = c.user_id
       WHERE c.post_id = ?
       ORDER BY c.created_at ASC`,
      [req.params.id]
    );
    res.json({ ...posts[0], comments });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/posts  -> create post (login required)
router.post('/', auth, async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title || !content || !title.trim() || !content.trim()) {
      return res.status(400).json({ message: 'Title and content are required' });
    }
    if (title.length > 200) {
      return res.status(400).json({ message: 'Title is too long (max 200)' });
    }
    const [result] = await db.query(
      'INSERT INTO posts (user_id, title, content) VALUES (?, ?, ?)',
      [req.user.id, title.trim(), content.trim()]
    );
    res.status(201).json({ id: result.insertId, message: 'Post created' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/posts/:id  -> edit own post
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title || !content || !title.trim() || !content.trim()) {
      return res.status(400).json({ message: 'Title and content are required' });
    }
    const [rows] = await db.query('SELECT user_id FROM posts WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Post not found' });
    if (rows[0].user_id !== req.user.id) {
      return res.status(403).json({ message: 'You can only edit your own posts' });
    }
    await db.query('UPDATE posts SET title = ?, content = ? WHERE id = ?', [
      title.trim(),
      content.trim(),
      req.params.id,
    ]);
    res.json({ message: 'Post updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/posts/:id  -> delete own post
router.delete('/:id', auth, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT user_id FROM posts WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Post not found' });
    if (rows[0].user_id !== req.user.id) {
      return res.status(403).json({ message: 'You can only delete your own posts' });
    }
    await db.query('DELETE FROM posts WHERE id = ?', [req.params.id]);
    res.json({ message: 'Post deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/posts/:id/comments  -> add comment (login required)
router.post('/:id/comments', auth, async (req, res) => {
  try {
    const { content } = req.body;
    if (!content || !content.trim()) {
      return res.status(400).json({ message: 'Comment cannot be empty' });
    }
    if (content.length > 1000) {
      return res.status(400).json({ message: 'Comment is too long (max 1000)' });
    }
    const [posts] = await db.query('SELECT id FROM posts WHERE id = ?', [req.params.id]);
    if (posts.length === 0) return res.status(404).json({ message: 'Post not found' });

    const [result] = await db.query(
      'INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)',
      [req.params.id, req.user.id, content.trim()]
    );
    res.status(201).json({ id: result.insertId, message: 'Comment added' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
