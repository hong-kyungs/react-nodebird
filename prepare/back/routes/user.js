const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');

const { User, Post } = require('../models');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

const router = express.Router();

//로그인 상태 유지 라우터
router.get('/', async (req, res, next) => {
	//GET /user
	try {
		if (req.user) {
			//req.user가 true면, 즉 로그인 정보가 있다면
			const fullUserWithoutPassword = await User.findOne({
				where: { id: req.user.id },
				attributes: {
					exclude: ['password'],
				},
				include: [
					{
						model: Post,
						attributes: ['id'],
					},
					{
						model: User,
						as: 'Followers',
						attributes: ['id'],
					},
					{
						model: User,
						as: 'Followings',
						attributes: ['id'],
					},
				],
			});
			res.status(200).json(fullUserWithoutPassword);
		} else {
			//로그인 정보가 없으면 아무것도 보내주지 않으면 된다.
			res.status(200).json(null);
		}
	} catch (error) {
		console.error(error);
		next(error);
	}
});

//로그인 라우터
router.post('/login', isNotLoggedIn, (req, res, next) => {
	//local - done이 콜백같은 거라서 done이 가진 인자들이 전달된다
	//(서버에러, 성공객체, 클라이언트에러) = (err, user, info)
	passport.authenticate('local', (err, user, info) => {
		//서버쪽 에러
		if (err) {
			console.error(err);
			return next(err);
		}
		//클라이언트 에러가 있으면 - 로그인 실패하면
		if (info) {
			return res.status(401).send(info.reason);
		}
		//성공하면
		return req.login(user, async (loginErr) => {
			//혹시 패스포트 로그인에서 에러가 나면 -> 극히 드문경우
			if (loginErr) {
				console.error(loginErr);
				return next(loginErr);
			}
			//원래 있는 사용자 정보를 다시 가져와서 부족한 부분 추가
			const fullUserWithoutPassword = await User.findOne({
				where: { id: user.id },
				attributes: {
					exclude: ['password'],
				},
				include: [
					{
						model: Post,
						attributes: ['id'],
					},
					{
						model: User,
						as: 'Followers',
						attributes: ['id'],
					},
					{
						model: User,
						as: 'Followings',
						attributes: ['id'],
					},
				],
			});
			//여기까지 에러가 없으면 사용자 정보를 프론트로 넘겨주기
			//로그인시 cookie가 res.setHeader('Cookie', 'cxlhy') 와 같은 형식으로 보내준다.
			return res.status(200).json(fullUserWithoutPassword);
		});
	})(req, res, next);
});

//회원가입 라우터
router.post('/', isNotLoggedIn, async (req, res, next) => {
	// POST/ user/
	try {
		const exUser = await User.findOne({
			where: {
				email: req.body.email,
			},
		});
		if (exUser) {
			return res.status(403).send('이미 사용중인 아이디입니다.');
		}
		const hashedPassword = await bcrypt.hash(req.body.password, 12);
		await User.create({
			email: req.body.email,
			nickname: req.body.nickname,
			password: hashedPassword,
		});
		res.status(200).send('ok');
	} catch (error) {
		console.error(error);
		next(error);
	}
});

//로그아웃 라우터
router.post('/logout', isLoggedIn, (req, res, next) => {
	req.logout(() => {
		res.send('ok');
	});
	// req.logout(() => {});
	// // req.session.destroy();
	// res.send('ok');
});

//닉네임 수정 라우터
router.patch('/nickname', isLoggedIn, async (req, res, next) => {
	try {
		await User.update(
			{
				nickname: req.body.nickname, // 2. 프론트에 작성된 nickname을 update를 통해서 수정
			},
			{
				where: { id: req.user.id }, // 1. 내 아이디의 닉네임을 찾아서
			}
		);
		res.status(200).json({ nickname: req.body.nickname });
	} catch (error) {
		console.error(error);
		next(error);
	}
});

//팔로우 라우터
router.patch('/:userId/follow', isLoggedIn, async (req, res, next) => {
	//PATCH /user/1/follow
	try {
		const user = await User.findOne({ where: { id: req.params.userId } });
		if (!user) {
			res.status(403).send('없는 사람을 팔로우하려고 하시네여?');
		}
		await user.addFollowers(req.user.id);
		res.status(200).json({ UserId: parseInt(req.params.userId, 10) });
	} catch (error) {
		console.error(error);
		next(error);
	}
});

//언팔로우 라우터
router.delete('/:userId/follow', isLoggedIn, async (req, res, next) => {
	//DELETE /user/1/follow
	try {
		const user = await User.findOne({ where: { id: req.params.userId } });
		if (!user) {
			res.status(403).send('없는 사람을 언팔로우하려고 하시네여?');
		}
		await user.removeFollowers(req.user.id);
		res.status(200).json({ UserId: parseInt(req.params.userId, 10) });
	} catch (error) {
		console.error(error);
		next(error);
	}
});

//팔로우 목록 불러오기 라우터
router.get('/followers', isLoggedIn, async (req, res, next) => {
	// GET /user/followers
	//PATCH /user/1/follow
	try {
		const user = await User.findOne({ where: { id: req.user.id } }); //1. 일단 나를 찾고,
		if (!user) {
			res.status(403).send('없는 사람을 찾으려고 하시네여?');
		}
		const followers = await user.getFollowers(); //2. 팔로우 목록 가져오기
		res.status(200).json(followers);
	} catch (error) {
		console.error(error);
		next(error);
	}
});

//팔로잉 목록 불러오기 라우터
router.get('/followings', isLoggedIn, async (req, res, next) => {
	// GET /user/followings
	//PATCH /user/1/follow
	try {
		const user = await User.findOne({ where: { id: req.user.id } });
		if (!user) {
			res.status(403).send('없는 사람을 찾으려고 하시네여?');
		}
		const followings = await user.getFollowings();
		res.status(200).json(followings);
	} catch (error) {
		console.error(error);
		next(error);
	}
});

module.exports = router;
