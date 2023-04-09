export const initialState = {
	mainPosts: [
		{
			id: 1,
			User: {
				id: 1,
				nickname: '제로초',
			},
			content: '첫번째 게시글 #해시태그 #익스프레스',
			Images: [
				{
					src: 'https://images.unsplash.com/photo-1614102073832-030967418971?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2938&q=80',
				},
				{
					src: 'https://images.unsplash.com/photo-1495107334309-fcf20504a5ab?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80',
				},
				{
					src: 'https://images.unsplash.com/photo-1526344966-89049886b28d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8JUVCJUIyJTlBJUVBJUJEJTgzfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60',
				},
			],
			Comments: [
				{
					User: {
						nickname: 'nero',
					},
					content: '첫번째 댓글입니다.',
				},
				{
					User: {
						nickname: 'hero',
					},
					content: '두번째 댓글입니다.',
				},
			],
		},
	],
	imagePaths: [],
	postAdded: false,
};

//게시물 작성하는 action
const ADD_POST = 'ADD_POST';
export const addPost = {
	type: ADD_POST,
};

const dummyPost = {
	id: 2,
	content: '더미데이터 입니다.',
	User: {
		id: 1,
		nickname: '제로초',
	},
	Images: [],
	Comments: [],
};

const reducer = (state = initialState, action) => {
	switch (action.type) {
		case ADD_POST:
			return {
				...state,
				mainPosts: [dummyPost, ...state.mainPosts],
				postAdded: true,
			};
		default:
			return state;
	}
};

export default reducer;
