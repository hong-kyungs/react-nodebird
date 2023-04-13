import { all, fork, put, takeLatest, delay } from 'redux-saga/effects';
import axios from 'axios';

function addPostAPI(data) {
	return axios.post('/apl/post', data);
}
function* addPost(action) {
	try {
		yield delay(1000);
		// const result = yield call(addPostAPI, action.data);
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

function* WatchAddPost() {
	yield takeLatest('ADD_POST_REQUEST', addPost);
}

export default function* postSaga() {
	yield all([fork(WatchAddPost)]);
}
