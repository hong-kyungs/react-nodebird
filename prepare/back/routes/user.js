const express = require('express');
const { User } = require('../models');
const bcrypt = require('bcrypt');
const passport = require('passport');

const router = express.Router();

//local - done이 콜백같은 거라서 done이 가진 인자들이 전달된다
//(서버에러, 성공객체, 클라이언트에러) = (err, user, info)
router.post('/login', (req, res, next) => {
	passport.authenticate('local', (err, user, info) => {
		//서버쪽 에러
		if (err) {
			console.error(err);
			return next(err);
		}
		//클라이언트 에러가 있으면
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
			//여기까지 에러가 없으면 사용자 정보를 프론트로 넘겨주기
			return res.json(user);
		});
	})(req, res, next);
});

router.post('/', async (req, res, next) => {
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

module.exports = router;
