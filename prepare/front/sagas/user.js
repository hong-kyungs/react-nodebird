import { all, fork, put, takeLatest, delay, call } from 'redux-saga/effects';
import axios from 'axios';
import {
	LOG_IN_REQUEST,
	LOG_IN_SUCCESS,
	LOG_IN_FAILURE,
	LOG_OUT_REQUEST,
	LOG_OUT_SUCCESS,
	LOG_OUT_FAILURE,
	FOLLOW_REQUEST,
	FOLLOW_SUCCESS,
	FOLLOW_FAILURE,
	UNFOLLOW_REQUEST,
	UNFOLLOW_SUCCESS,
	UNFOLLOW_FAILURE,
	SIGN_UP_REQUEST,
	SIGN_UP_SUCCESS,
	SIGN_UP_FAILURE,
} from '../reducers/user';

//logInAPI부분은 제너레이터가 아니다.
function logInAPI(data) {
	//이런한 코드를 사용해서 서버에 요청을 보낸다.
	return axios.post('/user/login', data);
}
function* logIn(action) {
	try {
		const result = yield call(logInAPI, action.data);
		yield put({
			type: LOG_IN_SUCCESS,
			data: result.data,
		});
	} catch (err) {
		yield put({
			type: LOG_IN_FAILURE,
			error: err.response.data,
		});
	}
}

function logOutAPI() {
	return axios.post('/user/logout');
}
function* logOut(action) {
	try {
		yield delay(1000);
		// const result = yield call(logOutAPI);
		yield put({
			type: LOG_OUT_SUCCESS,
			data: action.data,
		});
	} catch (err) {
		yield put({
			type: LOG_OUT_FAILURE,
			error: err.response.data,
		});
	}
}

function followAPI() {
	return axios.post('/apl/follow');
}
function* follow(action) {
	try {
		yield delay(1000);
		// const result = yield call(followAPI);
		yield put({
			type: FOLLOW_SUCCESS,
			data: action.data,
		});
	} catch (err) {
		yield put({
			type: FOLLOW_FAILURE,
			error: err.response.data,
		});
	}
}

function unfollowAPI() {
	return axios.post('/apl/unfollow');
}
function* unfollow(action) {
	try {
		yield delay(1000);
		// const result = yield call(unfollowAPI);
		yield put({
			type: UNFOLLOW_SUCCESS,
			data: action.data,
		});
	} catch (err) {
		yield put({
			type: UNFOLLOW_FAILURE,
			error: err.response.data,
		});
	}
}

function signUpAPI(data) {
	return axios.post('/user', data);
}
function* signUp(action) {
	try {
		const result = yield call(signUpAPI, action.data);
		console.log(result);
		yield put({
			type: SIGN_UP_SUCCESS,
		});
	} catch (err) {
		yield put({
			type: SIGN_UP_FAILURE,
			error: err.response.data,
		});
	}
}

function* WatchLogIn() {
	yield takeLatest(LOG_IN_REQUEST, logIn);
}

function* WatchLogOut() {
	yield takeLatest(LOG_OUT_REQUEST, logOut);
}

function* WatchFollow() {
	yield takeLatest(FOLLOW_REQUEST, follow);
}

function* WatchUnfollow() {
	yield takeLatest(UNFOLLOW_REQUEST, unfollow);
}

function* WatchSignUp() {
	yield takeLatest(SIGN_UP_REQUEST, signUp);
}

export default function* userSaga() {
	yield all([
		fork(WatchLogIn),
		fork(WatchLogOut),
		fork(WatchFollow),
		fork(WatchUnfollow),
		fork(WatchSignUp),
	]);
}
