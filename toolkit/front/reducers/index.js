import { HYDRATE } from 'next-redux-wrapper';
import { combineReducers } from 'redux';
import axios from 'axios';

import userSlice from './userSlice';
import postSlice from './postSlice';

axios.defaults.baseURL = 'http://localhost:3065';
axios.defaults.withCredentials = true;

const rootReducer = combineReducers({
	user: userSlice.reducer,
	post: postSlice.reducer,
});

export default rootReducer;
