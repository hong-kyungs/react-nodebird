const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');
const bcrypt = require('bcrypt');
const { User } = require('../models');

module.exports = () => {
	passport.use(
		new LocalStrategy(
			{
				usernameField: 'email',
				passwordField: 'password',
			},
			async (email, password, done) => {
				try {
					const user = await User.findOne({
						where: { email }, // { email : email }과 같다
					});
					//이메일이 존재하지 않으면
					if (!user) {
						return done(null, false, { reason: '존재하지 않는 이메일입니다.' });
					}
					//이메일이 존재하면 비밀번호 비교하기
					const result = await bcrypt.compare(password, user.password);
					//비밀번호가 일치하면
					if (result) {
						return done(null, user);
					}
					//비밀번호가 일치하지 않으면
					return done(null, false, { reason: '비밀번호가 틀렸습니다.' });
				} catch (error) {
					console.error(error);
					return done(error);
				}
			}
		)
	);
};
