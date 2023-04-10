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
	postAdded: false,
};

//게시물 작성하는 action
const ADD_POST = 'ADD_POST';
export const addPost = {
	type: ADD_POST,
};

const dummyPost = {
	id: 2,
	content: '게시글 더미데이터 입니다.',
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
