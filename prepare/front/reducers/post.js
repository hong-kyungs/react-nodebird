import shortId from 'shortid';

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
					src: 'https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyMTAzMTNfMTEy%2FMDAxNjE1NTY2NzM4NzY2.21mBLoWLO25wbu-I_VWT1E1pscV9Gvfm66TTLAqBa-sg.m96aAYpgdD1BXcxNshXA6iwW-q-GhOWwyT0Bf6xhaVgg.JPEG.applejamn%2F2019-04-05-12-33-25.jpg&type=sc960_832',
				},
				{
					src: 'https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyMzAzMTlfMjQ3%2FMDAxNjc5MTk2MjIxNjUz.tD-toSmNm6MAQepJ1cl0MvbS1e6k9YsYdNBK92BcfRkg.h749vKbUwWxHpNn9Lpsbp97EUOeurJ7DHUWZUJjyCnYg.JPEG.aldus_06%2Fspring-g1f438d858_1920.jpg&type=sc960_832',
				},
				{
					src: 'https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyMjA0MTJfMTgy%2FMDAxNjQ5NzMyMDM0ODIx.uj-4G5CpQDDJa8vz-cW-zd-RDj8s3ogKJb4JugKi0RUg.UOp-wNa-rXCmMPJ4ISva1uzkfky8H3TB9QFl4ZMqjXYg.JPEG.koter05280%2F0V3B0230333.jpg&type=sc960_832',
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
	addPostLoading: false,
	addPostDone: false,
	addPostError: null,
	addCommentLoading: false,
	addCommentDone: false,
	addCommentError: null,
};

export const ADD_POST_REQUEST = 'ADD_POST_REQUEST';
export const ADD_POST_SUCCESS = 'ADD_POST_SUCCESS';
export const ADD_POST_FAILURE = 'ADD_POST_FAILURE';

export const ADD_COMMENT_REQUEST = 'ADD_COMMENT_REQUEST';
export const ADD_COMMENT_SUCCESS = 'ADD_COMMENT_SUCCESS';
export const ADD_COMMENT_FAILURE = 'ADD_COMMENT_FAILURE';

//게시물 작성하는 action
export const addPost = (data) => ({
	type: ADD_POST_REQUEST,
	data,
});

export const addComment = (data) => ({
	type: ADD_COMMENT_REQUEST,
	data,
});

const dummyPost = (data) => ({
	id: shortId.generate(),
	content: data,
	User: {
		id: 1,
		nickname: '제로초',
	},
	Images: [],
	Comments: [],
});

const dummyComment = (data) => ({
	id: shortId.generate(),
	content: data,
	User: {
		id: 1,
		nickname: '제로초',
	},
});

const reducer = (state = initialState, action) => {
	switch (action.type) {
		case ADD_POST_REQUEST:
			return {
				...state,
				addPostLoading: true,
				addPostDone: false,
				addPostError: null,
			};
		case ADD_POST_SUCCESS:
			return {
				...state,
				mainPosts: [dummyPost(action.data), ...state.mainPosts],
				addPostLoading: false,
				addPostDone: true,
			};
		case ADD_POST_FAILURE:
			return {
				...state,
				addPostLoading: false,
				addPostError: action.error,
			};
		case ADD_COMMENT_REQUEST:
			return {
				...state,
				addCommentLoading: true,
				addCommentDone: false,
				addCommentError: null,
			};
		case ADD_COMMENT_SUCCESS:
			const postIndex = state.mainPosts.findIndex(
				(v) => v.id === action.data.postId
			);
			const post = { ...state.mainPosts[postIndex] };
			post.Comments = [dummyComment(action.data.content), ...post.Comments];
			const mainPosts = [...state.mainPosts];
			mainPosts[postIndex] = post;
			return {
				...state,
				mainPosts,
				addCommentLoading: false,
				addCommentDone: true,
			};
		case ADD_COMMENT_FAILURE:
			return {
				...state,
				addCommentLoading: false,
				addCommentError: action.error,
			};
		default:
			return state;
	}
};

export default reducer;
