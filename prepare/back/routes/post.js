const express = require('express');

const { Post, Image, Comment, User } = require('../models');
const { isLoggedIn } = require('./middlewares');

const router = express.Router();

// 게시글 작성 라우터
// '/post'로 중복되는 부분을 분리
router.post('/', isLoggedIn, async (req, res, next) => {
	// '/' 는 실제로는 '/post'다. POST /post
	try {
		const post = await Post.create({
			content: req.body.content,
			UserId: req.user.id,
		});
		const fullpost = await Post.findOne({
			where: { id: post.id },
			include: [
				{
					model: Image,
				},
				{
					model: Comment,
					include: [
						{
							model: User,
							attributes: ['id', 'nickname'],
						},
					],
				},
				{
					model: User,
					attributes: ['id', 'nickname'],
				},
			],
		});
		res.status(201).json(fullpost);
	} catch (error) {
		console.error(error);
		next(error);
	}
});

// 댓글 작성 라우터
router.post('/:postId/comment', isLoggedIn, async (req, res, next) => {
	// POST /post/1/comment
	try {
		const post = await Post.findOne({
			where: { id: req.params.postId },
		});
		if (!post) {
			return res.status(403).send('존재하지 않는 게시글입니다.');
		}
		const comment = await Comment.create({
			content: req.body.content,
			PostId: parseInt(req.params.postId, 10),
			UserId: req.user.id,
		});
		const fullComment = await Comment.findOne({
			where: { id: comment.id },
			include: [
				{
					model: User,
					attributes: ['id', 'nickname'],
				},
			],
		});
		res.status(201).json(fullComment);
	} catch (error) {
		console.error(error);
		next(error);
	}
});

router.delete('/', (req, res) => {
	// '/' 는 실제로는 '/post'다. DELETE /post
	res.json({ id: 1 });
});

module.exports = router;
