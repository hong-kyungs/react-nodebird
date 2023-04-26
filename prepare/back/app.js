const express = require('express');
const postRouter = require('./routes/post');

const app = express();

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

app.post('/post', (req, res) => {
	res.json({ id: 1, content: 'Hello' });
});

app.delete('/post', (req, res) => {
	res.json({ id: 1 });
});

app.listen(3065, () => {
	console.log('서버 실행 중');
});
