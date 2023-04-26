const express = require('express');

const router = express.Router();
// '/post'로 중복되는 부분을 분리
router.post('/', (req, res) => {
	// '/' 는 실제로는 '/post'다.
	res.json({ id: 1, content: 'Hello' });
});

router.delete('/', (req, res) => {
	// '/' 는 실제로는 '/post'다.
	res.json({ id: 1 });
});

module.exports = router;
