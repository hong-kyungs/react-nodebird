// next.js에서 redux를 붙일 때 복잡한데 이것을 간편하게 해주는 라이브러리가 next-redux-wrapper
import { createWrapper } from 'next-redux-wrapper';
import { applyMiddleware, compose, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';

import reducer from '../reducers';

const configureStore = () => {
	const middlewares = [];
	// history가 쌓이면 데이터로 잡아먹고, 중앙데이터가 어떻게 변하는지 보이기때문에 보안에 취약할 수 있어서 개발용에만 dev tool을 연결한다.
	const enhancer =
		process.env.NODE_ENV === 'production'
			? compose(applyMiddleware(...middlewares)) //개발용
			: composeWithDevTools(applyMiddleware(...middlewares)); // 배포용
	const store = createStore(reducer, enhancer);
	return store;
};

const wrapper = createWrapper(configureStore, {
	//옵션부분인데 debug부분이 true면 좀 더 리덕스에 관해 자세한 설명이 나오기 때문에 개발할 떄 넣어준다.
	debug: process.env.NODE_ENV === 'development',
});

export default wrapper;
