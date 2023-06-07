const express = require('express');

const { Post, User, Image, Comment } = require('../models');

const router = express.Router();

router.get('/', async (req, res, next) => {
	// GET /posts
	try {
		const posts = await Post.findAll({
			limit: 10,
			order: [
				['createdAt', 'DESC'], //게시글 내림차순 정렬
				[Comment, 'createdAt', 'DESC'], // 댓글 내림차순 정렬
			],
			include: [
				{
					model: User, // 게시글 작성자 정보도 같이 가져오기
					attributes: ['id', 'nickname'],
				},
				{
					model: Image,
				},
				{
					model: Comment,
					//댓글의 작성자 이름, 닉네임까지 가져오기
					include: [
						{
							model: User,
							attributes: ['id', 'nickname'],
						},
					],
				},
				{
					model: User,
					as: 'Likers',
					attributes: ['id'],
				},
				{
					model: Post,
					as: 'Retweet',
					include: [
						{
							model: User,
							attributes: ['id', 'nickname'],
						},
						{
							model: Image,
						},
					],
				},
			],
		});
		console.log(posts);
		res.status(200).json(posts);
	} catch (error) {
		console.error(error);
		next(error);
	}
});

module.exports = router;
