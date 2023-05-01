const express = require('express');
const postRouter = require('./routes/post');
const userRouter = require('./routes/user');
const db = require('./models');
const app = express();

db.sequelize
	.sync()
	.then(() => {
		console.log('db 연결 성공');
	})
	.catch(console.error);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
