const express = require('express');
const { Op } = require('sequelize');

const { Post, User, Image, Comment } = require('../models');

const router = express.Router();

router.get('/', async (req, res, next) => {
	// GET /posts
	try {
		const where = {};
		if (parseInt(req.query.lastId, 10)) {
			//초기 로딩이 아닐 때
			where.id = { [Op.lt]: parseInt(req.query.lastId, 10) }; //lastId보다 작은 id로... 10개(limit) 불러오기
			//ex) 12 11 10 9 8 7 6 5 4 3 2 1 , 라면 12~3까지
		}
		const posts = await Post.findAll({
			where,
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
