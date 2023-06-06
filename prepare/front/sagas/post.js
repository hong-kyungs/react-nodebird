import { all, fork, put, takeLatest, delay, call } from 'redux-saga/effects';
import axios from 'axios';
import {
	UPLOAD_IMAGES_REQUEST,
	UPLOAD_IMAGES_SUCCESS,
	UPLOAD_IMAGES_FAILURE,
	LIKE_POST_REQUEST,
	LIKE_POST_SUCCESS,
	LIKE_POST_FAILURE,
	UNLIKE_POST_REQUEST,
	UNLIKE_POST_SUCCESS,
	UNLIKE_POST_FAILURE,
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
} from '../reducers/post';
import { ADD_POST_TO_ME, REMOVE_POST_OF_ME } from '../reducers/user';

function uploadImagesAPI(data) {
	return axios.post('/post/images', data); //data에 Formdata가 그대로 들어온다
}
function* uploadImages(action) {
	try {
		const result = yield call(uploadImagesAPI, action.data);
		yield put({
			type: UPLOAD_IMAGES_SUCCESS,
			data: result.data, //백에드 좋아요라우터에서 PostId와 UserId를 받는다
		});
	} catch (err) {
		console.error(err);
		yield put({
			type: UPLOAD_IMAGES_FAILURE,
			data: err.response.data,
		});
	}
}

function likePostAPI(data) {
	return axios.patch(`/post/${data}/like`);
}
function* likePost(action) {
	try {
		const result = yield call(likePostAPI, action.data);
		yield put({
			type: LIKE_POST_SUCCESS,
			data: result.data, //백에드 좋아요라우터에서 PostId와 UserId를 받는다
		});
	} catch (err) {
		console.error(err);
		yield put({
			type: LIKE_POST_FAILURE,
			data: err.response.data,
		});
	}
}

function unlikePostAPI(data) {
	return axios.delete(`/post/${data}/like`);
}
function* unlikePost(action) {
	try {
		const result = yield call(unlikePostAPI, action.data);
		yield put({
			type: UNLIKE_POST_SUCCESS,
			data: result.data,
		});
	} catch (err) {
		console.error(err);
		yield put({
			type: UNLIKE_POST_FAILURE,
			data: err.response.data,
		});
	}
}

function loadPostsAPI(data) {
	return axios.get('/posts', data);
}
function* loadPosts(action) {
	try {
		const result = yield call(loadPostsAPI, action.data);
		yield put({
			type: LOAD_POSTS_SUCCESS,
			data: result.data,
		});
	} catch (err) {
		console.error(err);
		yield put({
			type: LOAD_POSTS_FAILURE,
			data: err.response.data,
		});
	}
}

function addPostAPI(data) {
	//formData는 { formData: data }처럼 묶어주면 안되고 바로 data로 전달해야한다.
	return axios.post('/post', data);
}
function* addPost(action) {
	try {
		const result = yield call(addPostAPI, action.data);
		yield put({
			type: ADD_POST_SUCCESS,
			data: result.data,
		});
		yield put({
			type: ADD_POST_TO_ME,
			data: result.data.id,
		});
	} catch (err) {
		console.error(err);
		yield put({
			type: ADD_POST_FAILURE,
			data: err.response.data,
		});
	}
}

function removePostAPI(data) {
	return axios.delete(`/post/${data}`); //data는 post.id를 받는다
}
function* removePost(action) {
	try {
		const result = yield call(removePostAPI, action.data);
		yield put({
			type: REMOVE_POST_SUCCESS,
			data: result.data,
		});
		yield put({
			type: REMOVE_POST_OF_ME,
			data: action.data,
		});
	} catch (err) {
		console.error(err);
		yield put({
			type: REMOVE_POST_FAILURE,
			data: err.response.data,
		});
	}
}

function addCommentAPI(data) {
	return axios.post(`/post/${data.postId}/comment`, data); //Post /post/1/comment - '1번 게시글에 댓글을 작성' 의미의 주소 생성
}
function* addComment(action) {
	try {
		const result = yield call(addCommentAPI, action.data);
		yield put({
			type: ADD_COMMENT_SUCCESS,
			data: result.data,
		});
	} catch (err) {
		console.error(err);
		yield put({
			type: ADD_COMMENT_FAILURE,
			data: err.response.data,
		});
	}
}

function* WatchuploadImages() {
	yield takeLatest(UPLOAD_IMAGES_REQUEST, uploadImages);
}
function* WatchLikePost() {
	yield takeLatest(LIKE_POST_REQUEST, likePost);
}
function* WatchUnlikePost() {
	yield takeLatest(UNLIKE_POST_REQUEST, unlikePost);
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
		fork(WatchuploadImages),
		fork(WatchLikePost),
		fork(WatchUnlikePost),
		fork(WatchLoadPosts),
		fork(WatchAddPost),
		fork(WatchRemovePost),
		fork(WatchAddComment),
	]);
}
