const Notice = require('../models/Notice');

// Create Notice
const createNotice = async (req, res) => {
  try {
    const { title, description, eventDate } = req.body;
    const notice = new Notice({ title, description, eventDate });
    await notice.save();
    res.status(201).json(notice);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get All Notices
const getNotices = async (req, res) => {
  try {
    const notices = await Notice.find().sort({ createdAt: -1 });
    res.json(notices);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update Notice
const updateNotice = async (req, res) => {
  try {
    const notice = await Notice.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(notice);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete Notice
const deleteNotice = async (req, res) => {
  try {
    await Notice.findByIdAndDelete(req.params.id);
    res.json({ message: 'Notice deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createNotice, getNotices, updateNotice, deleteNotice };
