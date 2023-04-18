import { all, fork, put, takeLatest, delay } from 'redux-saga/effects';
import axios from 'axios';
import {
	ADD_POST_REQUEST,
	ADD_POST_SUCCESS,
	ADD_POST_FAILURE,
	ADD_COMMENT_REQUEST,
	ADD_COMMENT_SUCCESS,
	ADD_COMMENT_FAILURE,
} from '../reducers/post';

function addPostAPI(data) {
	return axios.post('/apl/post', data);
}
function* addPost(action) {
	try {
		yield delay(1000);
		// const result = yield call(addPostAPI, action.data);
		yield put({
			type: ADD_POST_SUCCESS,
			data: action.data,
		});
	} catch (err) {
		yield put({
			type: ADD_POST_FAILURE,
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

function* WatchAddPost() {
	yield takeLatest(ADD_POST_REQUEST, addPost);
}

function* WatchAddComment() {
	yield takeLatest(ADD_COMMENT_REQUEST, addComment);
}

export default function* postSaga() {
	yield all([fork(WatchAddPost), fork(WatchAddComment)]);
}
