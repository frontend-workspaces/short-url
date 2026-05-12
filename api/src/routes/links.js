const router = require('express').Router();
const auth = require('../middleware/auth');
const { getLinks, createLink, updateLink, deleteLink, getLogs } = require('../controllers/linkController');

router.use(auth);
router.get('/', getLinks);
router.post('/', createLink);
router.put('/:id', updateLink);
router.delete('/:id', deleteLink);
router.get('/:id/logs', getLogs);

module.exports = router;
