import { HYDRATE } from 'next-redux-wrapper';
import { combineReducers } from 'redux';

import user from './user';
import post from './post';

//(이전상태, 액션) => 다음상태
//리듀서는 이전상태와 액션을 받아서 다음상태를 만들어내는 함수
const rootReducer = combineReducers({
	//server side rendering을 위해 hydrate를 넣어줘야하고, 이것을 넣어주기위해서 index 리듀서를 추가
	index: (state = {}, action) => {
		switch (action.type) {
			case HYDRATE:
				return { ...state, ...action.payload };
			default:
				return state;
		}
	},
	user,
	post,
});

export default rootReducer;
