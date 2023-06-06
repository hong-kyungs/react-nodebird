const express = require('express');
const multer = require('multer');
const path = require('path'); // path는 노드에서 제공
const fs = require('fs'); //노드에서 파일 시스템을 조작해주는 모듈

const { Post, Image, Comment, User } = require('../models');
const { isLoggedIn } = require('./middlewares');

const router = express.Router();

try {
	fs.accessSync('uploads'); //'uploads'라는 폴더가 있는지 확인하고
} catch (error) {
	console.log('uploads 폴더가 없으므로 생성합니다.');
	fs.mkdirSync('uploads'); //'uploads'라는 폴더 생성
}

// form마다 형식이 다르기때문에 multer미들웨어를 사용해서 라우터마다 별도의 세팅을 해줘야한다.
const upload = multer({
	//storage는 저장할 곳을 적어준다. 일단 실습할때는 diskStorage로 하드웨어에 저장.
	//나중에는 하드웨어가 아니라 클라우드에 저장. 나중에 storage 옵션만 s3옵션으로 바꾸면 된다.
	storage: multer.diskStorage({
		destination(req, file, done) {
			done(null, 'uploads'); //'upload'라는 폴더에 저장한다.
		},
		//파일명이 중복되면 노드는 기존파일을 덮어씌운다. 먼저 파일을 올리사람이 피해를 볼 수 있다
		//이를 해결하기 위해 파일명에 업로드 날짜를 추가해줘서 파일명이 중복되는 것을 방지
		filename(req, file, done) {
			//ex) 제로초.png 라면,
			const ext = path.extname(file.originalname); //확장자 추출 -> .png
			const basename = path.basename(file.originalname, ext); // 파일명 꺼내오기 -> 제로초
			done(null, basename + '_' + new Date().getTime() + ext); //제로초15390285762.png
		},
	}),
	limits: { fileSize: 20 * 1024 * 1024 }, //20MB, 20MB으로 제한
});

// 게시글 작성 라우터
// '/post'로 중복되는 부분을 분리
router.post('/', isLoggedIn, upload.none(), async (req, res, next) => {
	// '/' 는 실제로는 '/post'다. POST /post
	try {
		const post = await Post.create({
			content: req.body.content,
			UserId: req.user.id,
		});
		if (req.body.image) {
			//req.body.image에 imagePath가 들어간다.
			if (Array.isArray(req.body.image)) {
				//이미지를 여러개 올리면 image: [제로초.png, 부기초.png] 와 같이 배열로 들어간다.
				const images = await Promise.all(
					req.body.image.map((image) => Image.create({ src: image }))
				);
				await post.addImages(images);
			} else {
				//이미지를 하나면 올리면 image: 제로초.png 와 같이 배열로 감싸지지 않는다.
				const image = await Image.create({ src: req.body.image });
				await post.addImages(image);
			}
		}
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
							model: User, // 댓글 작성자
							attributes: ['id', 'nickname'],
						},
					],
				},
				{
					model: User, // 게시글 작성자
					attributes: ['id', 'nickname'],
				},
				{
					model: User, // 좋아요 누른 사람
					as: 'Likers',
					attributes: ['id'],
				},
			],
		});
		res.status(201).json(fullpost);
	} catch (error) {
		console.error(error);
		next(error);
	}
});

// 이미지 업로드 라우터
router.post(
	'/images',
	isLoggedIn,
	upload.array('image'),
	async (req, res, next) => {
		//POST /post/images
		console.log(req.files);
		res.json(req.files.map((v) => v.filename));
	}
);

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

//좋아요 라우터
router.patch('/:postId/like', isLoggedIn, async (req, res, next) => {
	// PATCH /post/1/like
	try {
		//먼저 게시글이 있는지 확인
		const post = await Post.findOne({ where: { id: req.params.postId } });
		//게시글이 없으면(게시글이 없는데 좋아요를 누르면)
		if (!post) {
			return res.status(403).send('게시글이 존재하지 않습니다.');
		}
		//게시글이 있으면
		await post.addLikers(req.user.id);
		res.json({ PostId: post.id, UserId: req.user.id });
	} catch (error) {
		console.error(error);
		next(error);
	}
});

//좋아요 취소 라우터
router.delete('/:postId/like', isLoggedIn, async (req, res, next) => {
	//DELETE /post/1/like
	try {
		//먼저 게시글이 있는지 확인
		const post = await Post.findOne({ where: { id: req.params.postId } });
		//게시글이 없으면(게시글이 없는데 좋아요를 누르면)
		if (!post) {
			return res.status(403).send('게시글이 존재하지 않습니다.');
		}
		//게시글이 있으면
		await post.removeLikers(req.user.id);
		res.json({ PostId: post.id, UserId: req.user.id });
	} catch (error) {
		console.error(error);
		next(error);
	}
});

//게시글 삭제 라우터
router.delete('/:postId', isLoggedIn, async (req, res, next) => {
	// '/' 는 실제로는 '/post'다. // DELETE /post/1
	try {
		//시퀄라이즈에서 제거할 때는 destroy를 쓴다.
		await Post.destroy({
			where: { id: req.params.postId, UserId: req.user.id },
		});
		res.json({ PostId: parseInt(req.params.postId, 10) });
	} catch (error) {
		console.error(error);
		next(error);
	}
});

module.exports = router;
