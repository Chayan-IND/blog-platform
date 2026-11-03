const express = require('express');
const db = require('../db');
const auth = require('../middleware/auth');

const router = express.Router();

// DELETE /api/comments/:id  -> delete own comment
router.delete('/:id', auth, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT user_id FROM comments WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Comment not found' });
    if (rows[0].user_id !== req.user.id) {
      return res.status(403).json({ message: 'You can only delete your own comments' });
    }
    await db.query('DELETE FROM comments WHERE id = ?', [req.params.id]);
    res.json({ message: 'Comment deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
