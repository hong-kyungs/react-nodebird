import { HYDRATE } from 'next-redux-wrapper';
import { combineReducers } from 'redux';

import userSlice from './userSlice';
import postSlice from './postSlice';

const rootReducer = combineReducers({
	user: userSlice.reducer,
	post: postSlice.reducer,
});

export default rootReducer;
