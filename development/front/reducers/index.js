import { HYDRATE } from 'next-redux-wrapper';
import { combineReducers } from 'redux';

import user from './user';
import post from './post';

//(이전상태, 액션) => 다음상태
//리듀서는 이전상태와 액션을 받아서 다음상태를 만들어내는 함수
const rootReducer = (state, action) => {
	switch (action.type) {
		//server side rendering을 위해 hydrate를 넣어줘야함.
		//HYDRATE의 등장은 SSR 위한 것으로, getInitialProps 와 getServerSideProps에서도 Redux store에 접근이 가능하도록 하기 위한 처리.
		case HYDRATE:
			console.log('HYDRATE', action);
			return action.payload;
		default: {
			const combineReducer = combineReducers({
				// 분리된 redecer를 combineReducers를 사용해 합쳐준다.
				user,
				post,
			});
			return combineReducer(state, action);
		}
	}
};

export default rootReducer;
