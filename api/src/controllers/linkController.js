const { nanoid } = require('nanoid');
const Link = require('../models/Link');
const RedirectLog = require('../models/RedirectLog');

exports.getLinks = async (req, res) => {
  try {
    const links = await Link.find().sort({ createdAt: -1 });
    res.json(links);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createLink = async (req, res) => {
  try {
    const { originalUrl, title, code } = req.body;
    if (!originalUrl) return res.status(400).json({ message: 'originalUrl is required' });
    const shortCode = code?.trim() || nanoid(7);
    const link = await Link.create({
      code: shortCode,
      originalUrl,
      title,
      createdBy: req.user.id,
    });
    res.status(201).json(link);
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ message: 'Short code already exists' });
    res.status(400).json({ message: err.message });
  }
};

exports.updateLink = async (req, res) => {
  try {
    const { title, originalUrl, isActive } = req.body;
    const link = await Link.findByIdAndUpdate(
      req.params.id,
      { title, originalUrl, isActive },
      { new: true, runValidators: true }
    );
    if (!link) return res.status(404).json({ message: 'Link not found' });
    res.json(link);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteLink = async (req, res) => {
  try {
    const link = await Link.findByIdAndDelete(req.params.id);
    if (!link) return res.status(404).json({ message: 'Link not found' });
    await RedirectLog.deleteMany({ link: req.params.id });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getLogs = async (req, res) => {
  try {
    const logs = await RedirectLog.find({ link: req.params.id })
      .sort({ createdAt: -1 })
      .limit(200);
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
