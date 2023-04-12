import { all, fork, take, call, put } from 'redux-saga/effects';
import axios from 'axios';

//logInAPI부분은 제너레이터가 아니다.
function logInAPI(data) {
	//이런한 코드를 사용해서 서버에 요청을 보낸다.
	return axios.post('/apl/login', data);
}
function* logIn(action) {
	try {
		const result = yield call(logInAPI, action.data);
		yield put({
			type: 'LOG_IN_SUCCESS',
			data: result.data,
		});
	} catch (err) {
		yield put({
			type: 'LOG_IN_FAILURE',
			data: err.response.data,
		});
	}
}

function logOutAPI() {
	return axios.post('/apl/logout');
}
function* logOut() {
	try {
		const result = yield call(logOutAPI);
		yield put({
			type: 'LOG_OUT_SUCCESS',
			data: result.data,
		});
	} catch (err) {
		yield put({
			type: 'LOG_OUT_FAILURE',
			data: err.response.data,
		});
	}
}

function addPostAPI(data) {
	return axios.post('/apl/post', data);
}
function* addPost(action) {
	try {
		const result = yield call(addPostAPI, action.data);
		yield put({
			type: 'ADD_POST_SUCCESS',
			data: result.data,
		});
	} catch (err) {
		yield put({
			type: 'ADD_POST_FAILURE',
			data: err.response.data,
		});
	}
}

function* WatchLogIn() {
	yield take('LOG_IN_REQUEST', logIn);
}

function* WatchLogOut() {
	yield take('LOG_OUT_REQUEST', logOut);
}

function* WatchAddPost() {
	yield take('ADD_POST_REQUEST', addPost);
}

export default function* rootSaga() {
	yield all([fork(WatchLogIn), fork(WatchLogOut), fork(WatchAddPost)]);
}
