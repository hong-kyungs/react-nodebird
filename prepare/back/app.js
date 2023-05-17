const express = require('express');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const dotenv = require('dotenv');

const postRouter = require('./routes/post');
const userRouter = require('./routes/user');
const db = require('./models');
const app = express();
const passportConfig = require('./passport');

db.sequelize
	.sync()
	.then(() => {
		console.log('db 연결 성공');
	})
	.catch(console.error);

passportConfig();

app.use(
	cors({
		//*로 모두 다 허용해줬지만 실무에서는 실제로 요청이 허용될 주소를 넣어준다.
		origin: '*',
		credentials: false,
	})
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
	session({
		saveUninitialized: false,
		resave: false,
		secret: process.env.COOKIE_SECRET,
	})
);
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
	res.send('Hello Express');
});

app.get('/api', (req, res) => {
	res.send('Hello Api');
});

app.get('/posts', (req, res) => {
	res.json([
		{ id: 1, content: 'Hello' },
		{ id: 2, content: 'Hello2' },
		{ id: 3, content: 'Hello3' },
	]);
});

app.use('/post', postRouter);
app.use('/user', userRouter);

app.listen(3065, () => {
	console.log('서버 실행 중');
});
