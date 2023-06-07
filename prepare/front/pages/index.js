import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import AppLayout from '../components/AppLayout';
import PostForm from '../components/PostForm';
import PostCard from '../components/PostCard';
import { LOAD_POSTS_REQUEST } from '../reducers/post';
import { LOAD_MY_INFO_REQUEST } from '../reducers/user';

const Home = () => {
	const dispatch = useDispatch();
	const { me } = useSelector((state) => state.user);
	const { mainPosts, hasMorePosts, loadPostsLoading, retweetError } =
		useSelector((state) => state.post);

	//리트윗 에러시 alert로 알려주기
	//PostCard에 넣으면 게시글수만큼 리렌더링이 되기 때문에 한번만 보여주기 위해 상위로 끌어올림.
	useEffect(() => {
		if (retweetError) {
			alert(retweetError);
		}
	}, [retweetError]);

	//화면 초기 로딩
	useEffect(() => {
		//로그인 상태 복구 - 새로고침해도 로그인이 남아있도록
		dispatch({
			type: LOAD_MY_INFO_REQUEST,
		});
		//화면 초기 로딩 - 화면을 로딩하면 LOAD_POSTS_REQUEST를  바로 호출해준다.
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
