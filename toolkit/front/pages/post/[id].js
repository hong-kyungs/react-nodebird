import React from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { END } from 'redux-saga';
import axios from 'axios';
import Head from 'next/head';

import wrapper from '../../store/configureStore';
import { LOAD_MY_INFO_REQUEST } from '../../reducers/user';
import { LOAD_POST_REQUEST } from '../../reducers/post';
import AppLayout from '../../components/AppLayout';
import PostCard from '../../components/PostCard';

const Post = () => {
	const router = useRouter();
	const { id } = router.query; // id를 사용해서 게시글을 랜더링한다.
	const { singlePost } = useSelector((state) => state.post);

	return (
		<AppLayout>
			{/* 검색엔진에 최적화되도록 '~의 게시글'이런식으로 title을 넣어주는게 좋다. Head가 검색엔진에 정보 제공 */}
			<Head>
				<title>
					{singlePost.User.nickname}
					님의 글
				</title>
				<meta name='description' content={singlePost.content} />
				<meta
					property='og:title' // 카톡, 페북, 트위트 등에 공유하면, og가 미리보기 형식으로 보여주게한다.
					content={`${singlePost.User.nickname}님의 게시글`}
				/>
				<meta property='og:description' content={singlePost.content} />
				<meta
					property='og:image'
					content={
						singlePost.Images[0]
							? singlePost.Images[0].src
							: 'https://nodebird.com/favicon.ico'
					}
				/>
				<meta property='og:url' content={`https://nodebird.com/post/${id}`} />
			</Head>
			<PostCard post={singlePost} />
		</AppLayout>
	);
};

export const getServerSideProps = wrapper.getServerSideProps(
	(store) =>
		async ({ req, params }) => {
			const cookie = req ? req.headers.cookie : '';
			axios.defaults.headers.Cookie = '';
			if (req && cookie) {
				axios.defaults.headers.Cookie = cookie;
			}
			store.dispatch({
				type: LOAD_MY_INFO_REQUEST,
			});
			store.dispatch({
				type: LOAD_POST_REQUEST,
				data: params.id, //params.id로 useRouter의 id에 접근이 가능하다.
			});
			store.dispatch(END);
			await store.sagaTask.toPromise();
		}
);

export default Post;
