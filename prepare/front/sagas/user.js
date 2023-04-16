import { all, fork, put, takeLatest, delay } from 'redux-saga/effects';
import axios from 'axios';
import {
	LOG_IN_REQUEST,
	LOG_IN_SUCCESS,
	LOG_IN_FAILURE,
	LOG_OUT_REQUEST,
	LOG_OUT_SUCCESS,
	LOG_OUT_FAILURE,
	SIGN_UP_REQUEST,
	SIGN_UP_SUCCESS,
	SIGN_UP_FAILURE,
} from '../reducers/user';

//logInAPI부분은 제너레이터가 아니다.
function logInAPI(data) {
	//이런한 코드를 사용해서 서버에 요청을 보낸다.
	return axios.post('/apl/login', data);
}
function* logIn(action) {
	try {
		console.log('saga login');
		yield delay(1000); // 서버 구현시 없어질 예정
		// 나중에 서버 만들면 활성화시켜줄 예정
		// const result = yield call(logInAPI, action.data);
		yield put({
			type: LOG_IN_SUCCESS,
			data: action.data,
		});
	} catch (err) {
		yield put({
			type: LOG_IN_FAILURE,
			error: err.response.data,
		});
	}
}

function logOutAPI() {
	return axios.post('/apl/logout');
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

function signUpAPI() {
	return axios.post('/apl/logout');
}
function* signUp(action) {
	try {
		yield delay(1000);
		// const result = yield call(signUpAPI);
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
function* WatchSignUp() {
	yield takeLatest(SIGN_UP_REQUEST, signUp);
}

export default function* userSaga() {
	yield all([fork(WatchLogIn), fork(WatchLogOut), fork(WatchSignUp)]);
}
