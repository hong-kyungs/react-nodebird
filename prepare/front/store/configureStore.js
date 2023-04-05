// next.js에서 redux를 붙일 때 복잡한데 이것을 간편하게 해주는 라이브러리가 next-redux-wrapper
import { createWrapper } from 'next-redux-wrapper';
import { createStore } from 'redux';

import reducer from '../reducers';

const configureStore = () => {
	const store = createStore(reducer);
	return store;
};

const wrapper = createWrapper(configureStore, {
	//옵션부분인데 debug부분이 true면 좀 더 리덕스에 관해 자세한 설명이 나오기 때문에 개발할 떄 넣어준다.
	debug: process.env.NODE_ENV === 'development',
});

export default wrapper;
