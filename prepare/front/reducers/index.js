const initialState = {
	user: {
		isLoggedIn: false,
		user: null,
		signUpData: {},
		loginData: {},
	},
	post: {
		mainPosts: [],
	},
};

//action creator
export const loginAction = (data) => {
	return {
		type: 'LOG_IN',
		data,
	};
};

export const logoutAction = () => {
	return {
		type: 'LOG_OUT',
	};
};

// const changeNickname = {
//   type: 'CHANGE_NICKNAME',
//   data: 'boogiCho'
// }

//action creator
// const changeNickname = (data) => {
// 	return {
// 		type: 'CHANGE_NICKNAME',
// 		data,
// 	};
// };

//(이전상태, 액션) => 다음상태
//리듀서는 이전상태와 액션을 받아서 다음상태를 만들어내는 함수
const rootReducer = (state = initialState, action) => {
	switch (action.type) {
		case 'LOG_IN':
			return {
				...state,
				user: {
					//안바뀌는 부분은 spread로 참조관계유지
					...state.user,
					isLoggedIn: true,
					user: action.data,
				},
			};
		case 'LOG_OUT':
			return {
				...state,
				user: {
					//안바뀌는 부분은 spread로 참조관계유지
					...state.user,
					isLoggedIn: false,
					user: null,
				},
			};
		default:
			return state;
	}
};

export default rootReducer;
