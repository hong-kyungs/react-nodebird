const express = require('express');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const dotenv = require('dotenv');
const morgan = require('morgan');

const postRouter = require('./routes/post');
const postsRouter = require('./routes/posts');
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

app.use(morgan('dev'));
app.use(
	cors({
		//*로 모두 다 허용해줬지만 실무에서는 실제로 요청이 허용될 주소를 넣어준다.
		origin: 'http://localhost:3000',
		credentials: true,
	})
);

//프론트에서 백엔드로 데이터를 보낼때 express.json, express.urlencoded 이 두가지 형식만 받는다.
app.use(express.json()); // 프론트에서 axios로 데이터 보낼때
app.use(express.urlencoded({ extended: true })); //일반 form submit했을 때, urlencoded 방식으로 받는다.

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

app.use('/posts', postsRouter);
app.use('/post', postRouter);
app.use('/user', userRouter);

app.listen(3065, () => {
	console.log('서버 실행 중');
});
