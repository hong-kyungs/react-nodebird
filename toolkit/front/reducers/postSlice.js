import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { HYDRATE } from 'next-redux-wrapper';

export const initialState = {
	mainPosts: [],
	singlePost: null,
	imagePaths: [],
	hasMorePosts: true,
	likePostLoading: false,
	likePostDone: false,
	likePostError: null,
	unlikePostLoading: false,
	unlikePostDone: false,
	unlikePostError: null,
	loadPostLoading: false,
	loadPostDone: false,
	loadPostError: null,
	loadPostsLoading: false,
	loadPostsDone: false,
	loadPostsError: null,
	addPostLoading: false,
	addPostDone: false,
	addPostError: null,
	removePostLoading: false,
	removePostDone: false,
	removePostError: null,
	addCommentLoading: false,
	addCommentDone: false,
	addCommentError: null,
	uploadImagesLoading: false,
	uploadImagesDone: false,
	uploadImagesError: null,
	retweetLoading: false,
	retweetDone: false,
	retweetError: null,
};

export const addPost = createAsyncThunk('post/addPost', async (data) => {
	//addPostToMe는 아직 못넣음.
	const response = await axios.post('/post', data);
	return response.data;
});

export const removePost = createAsyncThunk('post/removePost', async (data) => {
	//RemovePostOfMe는 아직 못넣음.
	const response = await axios.post(`/post/${data}`);
	return response.data;
});

export const loadPosts = createAsyncThunk('post/loadPosts', async (lastId) => {
	const response = await axios.get(`/posts?lastId=${lastId || 0}`);
	return response.data;
});

export const addComment = createAsyncThunk('post/addComment', async (data) => {
	const response = await axios.post(`/post/${data.postId}/comment`, data);
	return response.data;
});

export const likePost = createAsyncThunk('post/likePost', async (data) => {
	const response = await axios.patch(`/post/${data}/like`);
	return response.data;
});

export const unlikePost = createAsyncThunk('post/unlikePost', async (data) => {
	const response = await axios.delete(`/post/${data}/like`);
	return response.data;
});

const postSlice = createSlice({
	name: 'post',
	initialState,
	reducers: {},
	extraReducers: (builder) =>
		builder
			.addCase(HYDRATE, (state, action) => ({
				...state,
				...action.payload.user,
			}))
			.addCase(addPost.pending, (state) => {
				state.addPostLoading = true;
				state.addPostDone = false;
				state.addPostError = null;
			})
			.addCase(addPost.fulfilled, (state, action) => {
				state.addPostLoading = false;
				state.addPostDone = true;
				state.mainPosts.unshift(action.payload);
				state.imagePaths = [];
			})
			.addCase(addPost.rejected, (state, action) => {
				state.addPostLoading = false;
				state.addPostError = action.error;
			})
			.addCase(removePost.pending, (state) => {
				state.removePostLoading = true;
				state.removePostDone = false;
				state.removePostError = null;
			})
			.addCase(removePost.fulfilled, (state, action) => {
				state.removePostLoading = false;
				state.removePostDone = true;
				state.mainPosts = state.mainPosts.filter(
					(v) => v.id !== action.payload.PostId
				);
			})
			.addCase(removePost.rejected, (state, action) => {
				state.removePostLoading = false;
				state.removePostError = action.error;
			})
			.addCase(loadPosts.pending, (state) => {
				state.loadPostsLoading = true;
				state.loadPostsDone = false;
				state.loadPostsError = null;
			})
			.addCase(loadPosts.fulfilled, (state, action) => {
				state.loadPostsLoading = false;
				state.loadPostsDone = true;
				state.mainPosts = state.mainPosts.concat(action.payload);
				state.hasMorePosts = action.payload.length === 10;
			})
			.addCase(loadPosts.rejected, (state, action) => {
				state.loadPostsLoading = false;
				state.loadPostsError = action.error;
			})
			.addCase(addComment.pending, (state) => {
				state.addCommentLoading = true;
				state.addCommentDone = false;
				state.addCommentError = null;
			})
			.addCase(addComment.fulfilled, (state, action) => {
				const post = state.mainPosts.find(
					(v) => v.id === action.payload.PostId
				); //게시글 찾고
				post.Comments.unshift(action.payload); //댓글추가
				state.addCommentLoading = false;
				state.addCommentDone = true;
			})
			.addCase(addComment.rejected, (state, action) => {
				state.addCommentLoading = false;
				state.addCommentError = action.error;
			})
			.addCase(likePost.pending, async (state) => {
				state.likePostLoading = true;
				state.likePostDone = false;
				state.likePostError = null;
			})
			.addCase(likePost.fulfilled, async (state, action) => {
				const post = state.mainPosts.find(
					(v) => v.id === action.payload.PostId
				);
				post.Likers.push({ id: action.payload.UserId });
				state.likePostLoading = false;
				state.likePostDone = true;
			})
			.addCase(likePost.rejected, async (state, action) => {
				state.likePostLoading = false;
				state.likePostError = action.error;
			})
			.addCase(unlikePost.pending, async (state) => {
				state.unlikePostLoading = true;
				state.unlikePostDone = false;
				state.unlikePostError = null;
			})
			.addCase(unlikePost.fulfilled, async (state, action) => {
				const post = state.mainPosts.find(
					(v) => v.id === action.payload.PostId
				);
				post.Likers = post.Likers.filter((v) => v.id !== action.payload.UserId);
				state.unlikePostLoading = false;
				state.unlikePostDone = true;
			})
			.addCase(unlikePost.rejected, async (state, action) => {
				state.unlikePostLoading = false;
				state.unlikePostError = action.err;
			}),
});

export default postSlice;
