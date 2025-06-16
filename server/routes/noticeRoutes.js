const express = require('express');
const {
  createNotice,
  getNotices,
  updateNotice,
  deleteNotice,
} = require('../controllers/noticeController');

const { authorize, isAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', createNotice);
router.get('/', getNotices);
router.put('/:id',updateNotice);
router.delete('/:id',deleteNotice);

module.exports = router; 