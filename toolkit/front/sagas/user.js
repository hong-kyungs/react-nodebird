import { all, fork, put, takeLatest, call } from 'redux-saga/effects';
import axios from 'axios';
import {
	REMOVE_FOLLOWER_REQUEST,
	REMOVE_FOLLOWER_SUCCESS,
	REMOVE_FOLLOWER_FAILURE,
	LOAD_FOLLOWERS_REQUEST,
	LOAD_FOLLOWERS_SUCCESS,
	LOAD_FOLLOWERS_FAILURE,
	LOAD_FOLLOWINGS_REQUEST,
	LOAD_FOLLOWINGS_SUCCESS,
	LOAD_FOLLOWINGS_FAILURE,
	CHANGE_NICKNAME_REQUEST,
	CHANGE_NICKNAME_SUCCESS,
	CHANGE_NICKNAME_FAILURE,
	LOAD_MY_INFO_REQUEST,
	LOAD_MY_INFO_SUCCESS,
	LOAD_MY_INFO_FAILURE,
	LOAD_USER_REQUEST,
	LOAD_USER_SUCCESS,
	LOAD_USER_FAILURE,
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

function removeFollowerAPI(data) {
	return axios.delete(`/user/follower/${data}`); // data에 들어온 아이디로, 몇번 팔로우를 제거한다.
}
function* removeFollower(action) {
	try {
		const result = yield call(removeFollowerAPI, action.data);
		yield put({
			type: REMOVE_FOLLOWER_SUCCESS,
			data: result.data,
		});
	} catch (err) {
		yield put({
			type: REMOVE_FOLLOWER_FAILURE,
			error: err.response.data,
		});
	}
}

function loadFollowersAPI(data) {
	return axios.get('/user/followers', data);
}
function* loadFollowers(action) {
	try {
		const result = yield call(loadFollowersAPI, action.data);
		yield put({
			type: LOAD_FOLLOWERS_SUCCESS,
			data: result.data,
		});
	} catch (err) {
		yield put({
			type: LOAD_FOLLOWERS_FAILURE,
			error: err.response.data,
		});
	}
}

function loadFollowingsAPI(data) {
	return axios.get('/user/followings', data);
}
function* loadFollowings(action) {
	try {
		const result = yield call(loadFollowingsAPI, action.data);
		yield put({
			type: LOAD_FOLLOWINGS_SUCCESS,
			data: result.data,
		});
	} catch (err) {
		yield put({
			type: LOAD_FOLLOWINGS_FAILURE,
			error: err.response.data,
		});
	}
}

function changeNicknameAPI(data) {
	return axios.patch('/user/nickname', { nickname: data });
}
function* changeNickname(action) {
	try {
		const result = yield call(changeNicknameAPI, action.data);
		yield put({
			type: CHANGE_NICKNAME_SUCCESS,
			data: result.data,
		});
	} catch (err) {
		yield put({
			type: CHANGE_NICKNAME_FAILURE,
			error: err.response.data,
		});
	}
}

function loadUserAPI(data) {
	return axios.get(`/user/${data}`);
}
function* loadUser(action) {
	try {
		const result = yield call(loadUserAPI, action.data);
		yield put({
			type: LOAD_USER_SUCCESS,
			data: result.data,
		});
	} catch (err) {
		yield put({
			type: LOAD_USER_FAILURE,
			error: err.response.data,
		});
	}
}

function loadMyInfoAPI() {
	return axios.get('/user');
}
function* loadMyInfo() {
	try {
		const result = yield call(loadMyInfoAPI);
		yield put({
			type: LOAD_MY_INFO_SUCCESS,
			data: result.data,
		});
	} catch (err) {
		yield put({
			type: LOAD_MY_INFO_FAILURE,
			error: err.response.data,
		});
	}
}

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
function* logOut() {
	try {
		yield call(logOutAPI);
		yield put({
			type: LOG_OUT_SUCCESS,
		});
	} catch (err) {
		yield put({
			type: LOG_OUT_FAILURE,
			error: err.response.data,
		});
	}
}

function followAPI(data) {
	return axios.patch(`/user/${data}/follow`);
}
function* follow(action) {
	try {
		const result = yield call(followAPI, action.data);
		yield put({
			type: FOLLOW_SUCCESS,
			data: result.data,
		});
	} catch (err) {
		yield put({
			type: FOLLOW_FAILURE,
			error: err.response.data,
		});
	}
}

function unfollowAPI(data) {
	return axios.delete(`/user/${data}/follow`);
}
function* unfollow(action) {
	try {
		const result = yield call(unfollowAPI, action.data);
		yield put({
			type: UNFOLLOW_SUCCESS,
			data: result.data,
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

function* WatchRemoveFollower() {
	yield takeLatest(REMOVE_FOLLOWER_REQUEST, removeFollower);
}

function* WatchLoadFollowers() {
	yield takeLatest(LOAD_FOLLOWERS_REQUEST, loadFollowers);
}

function* WatchLoadFollowings() {
	yield takeLatest(LOAD_FOLLOWINGS_REQUEST, loadFollowings);
}

function* WatchChangeNickname() {
	yield takeLatest(CHANGE_NICKNAME_REQUEST, changeNickname);
}

function* WatchLoadMyInfo() {
	yield takeLatest(LOAD_MY_INFO_REQUEST, loadMyInfo);
}

function* WatchLoadUser() {
	yield takeLatest(LOAD_USER_REQUEST, loadUser);
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
		fork(WatchRemoveFollower),
		fork(WatchLoadFollowers),
		fork(WatchLoadFollowings),
		fork(WatchChangeNickname),
		fork(WatchLoadMyInfo),
		fork(WatchLoadUser),
		fork(WatchLogIn),
		fork(WatchLogOut),
		fork(WatchFollow),
		fork(WatchUnfollow),
		fork(WatchSignUp),
	]);
}