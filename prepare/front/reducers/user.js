export const initialState = {
	isLoggingIn: false, //로그인 시도중
	isLoggedIn: false,
	isLoggingOut: false, //로그아웃 시도중
	me: null,
	signUpData: {},
	loginData: {},
};

//action creator
export const loginRequestAction = (data) => {
	return {
		type: 'LOG_IN_REQUEST',
		data,
	};
};

export const logoutRequestAction = () => {
	return {
		type: 'LOG_OUT_REQUEST',
	};
};

//(이전상태, 액션) => 다음상태
//리듀서는 이전상태와 액션을 받아서 다음상태를 만들어내는 함수
const reducer = (state = initialState, action) => {
	switch (action.type) {
		case 'LOG_IN_REQUEST':
			console.log('reducer login');
			return {
				...state,
				isLoggingIn: true,
			};
		case 'LOG_IN_SUCCESS':
			return {
				...state,
				isLoggingIn: false,
				isLoggedIn: true,
				me: { ...action.data, nickname: 'JennyCho' },
			};
		case 'LOG_IN_FAILURE':
			return {
				...state,
				isLoggingIn: false,
				isLoggedIn: false,
			};
		case 'LOG_OUT_REQUEST':
			return {
				...state,
				isLoggingIn: false,
				isLoggingOut: true,
			};
		case 'LOG_OUT_SUCCESS':
			return {
				...state,
				isLoggingOut: false,
				isLoggedIn: false,
				me: null,
			};
		case 'LOG_OUT_FAILURE':
			return {
				...state,
				isLoggingOut: false,
				me: null,
			};
		default:
			return state;
	}
};

export default reducer;
