import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import AppLayout from '../components/AppLayout';
import PostForm from '../components/PostForm';
import PostCard from '../components/PostCard';
import { LOAD_POSTS_REQUEST } from '../reducers/post';

const Home = () => {
	const dispatch = useDispatch();
	const { me } = useSelector((state) => state.user);
	const { mainPosts, hasMorePosts, loadPostsLoading } = useSelector(
		(state) => state.post
	);
	//화면 초기 로딩 - 화면을 로딩하면 LOAD_POSTS_REQUEST를  바로 호출해준다.
	useEffect(() => {
		dispatch({
			type: LOAD_POSTS_REQUEST,
		});
	}, []);

	useEffect(() => {
		function onScroll() {
			if (
				window.scrollY + document.documentElement.clientHeight >
				document.documentElement.scrollHeight - 300
			) {
				if (hasMorePosts && !loadPostsLoading) {
					dispatch({
						type: LOAD_POSTS_REQUEST,
					});
				}
			}
		}
		//useEffect에서 accEventListener를 쓰면 항상 리턴으로 remove해야한다.
		//그렇지 않으면 메모리에 계속 쌓여있다.
		window.addEventListener('scroll', onScroll);
		return () => {
			window.removeEventListener('scroll', onScroll);
		};
	}, [hasMorePosts, loadPostsLoading]);

	return (
		<AppLayout>
			{/* 로그인한 사람에게 게시글작성 보여주기 */}
			{me && <PostForm />}
			{mainPosts.map((post) => (
				<PostCard key={post.id} post={post} />
			))}
		</AppLayout>
	);
};

export default Home;
