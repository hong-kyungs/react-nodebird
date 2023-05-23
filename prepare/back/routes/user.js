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
	req.logout(() => {});
	req.session.destroy();
	res.send('ok');
});

module.exports = router;
