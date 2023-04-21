import { all, fork, put, takeLatest, delay } from 'redux-saga/effects';
import axios from 'axios';
import {
	LOAD_POSTS_REQUEST,
	LOAD_POSTS_SUCCESS,
	LOAD_POSTS_FAILURE,
	ADD_POST_REQUEST,
	ADD_POST_SUCCESS,
	ADD_POST_FAILURE,
	REMOVE_POST_REQUEST,
	REMOVE_POST_SUCCESS,
	REMOVE_POST_FAILURE,
	ADD_COMMENT_REQUEST,
	ADD_COMMENT_SUCCESS,
	ADD_COMMENT_FAILURE,
	generateDummyPost,
} from '../reducers/post';
import { ADD_POST_TO_ME, REMOVE_POST_OF_ME } from '../reducers/user';
import shortid from 'shortid';

function loadPostsAPI(data) {
	return axios.get('/apl/post', data);
}
function* loadPosts(action) {
	try {
		yield delay(1000);
		// const result = yield call(addPostAPI, action.data);
		yield put({
			type: LOAD_POSTS_SUCCESS,
			data: generateDummyPost(10),
		});
	} catch (err) {
		yield put({
			type: LOAD_POSTS_FAILURE,
			data: err.response.data,
		});
	}
}

function addPostAPI(data) {
	return axios.post('/apl/post', data);
}
function* addPost(action) {
	try {
		yield delay(1000);
		// const result = yield call(addPostAPI, action.data);
		const id = shortid.generate();
		yield put({
			type: ADD_POST_SUCCESS,
			data: {
				id,
				content: action.data,
			},
		});
		yield put({
			type: ADD_POST_TO_ME,
			data: id,
		});
	} catch (err) {
		yield put({
			type: ADD_POST_FAILURE,
			data: err.response.data,
		});
	}
}

function removePostAPI(data) {
	return axios.delete('/apl/post', data);
}
function* removePost(action) {
	try {
		yield delay(1000);
		// const result = yield call(removePostAPI, action.data);
		yield put({
			type: REMOVE_POST_SUCCESS,
			data: action.data,
		});
		yield put({
			type: REMOVE_POST_OF_ME,
			data: action.data,
		});
	} catch (err) {
		yield put({
			type: REMOVE_POST_FAILURE,
			data: err.response.data,
		});
	}
}

function addCommentAPI(data) {
	return axios.post(`/apl/post/${data.postId}/omment`, data);
}
function* addComment(action) {
	try {
		yield delay(1000);
		// const result = yield call(addPostAPI, action.data);
		yield put({
			type: ADD_COMMENT_SUCCESS,
			data: action.data,
		});
	} catch (err) {
		yield put({
			type: ADD_COMMENT_FAILURE,
			data: err.response.data,
		});
	}
}

function* WatchLoadPosts() {
	yield takeLatest(LOAD_POSTS_REQUEST, loadPosts);
}

function* WatchAddPost() {
	yield takeLatest(ADD_POST_REQUEST, addPost);
}

function* WatchRemovePost() {
	yield takeLatest(REMOVE_POST_REQUEST, removePost);
}

function* WatchAddComment() {
	yield takeLatest(ADD_COMMENT_REQUEST, addComment);
}

export default function* postSaga() {
	yield all([
		fork(WatchLoadPosts),
		fork(WatchAddPost),
		fork(WatchRemovePost),
		fork(WatchAddComment),
	]);
}
