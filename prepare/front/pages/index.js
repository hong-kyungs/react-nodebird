import React from 'react';
import { useSelector } from 'react-redux';

import AppLayout from '../components/AppLayout';
import PostForm from '../components/PostForm';
import PostCard from '../components/PostCard';

const Home = () => {
	const { isLoggedIn } = useSelector((state) => state.user);
	const { mainPosts } = useSelector((state) => state.post);
	return (
		<AppLayout>
			{/* 로그인한 사람에게 게시글작성 보여주기 */}
			{isLoggedIn && <PostForm />}
			{mainPosts.map((post) => (
				<PostCard key={post.id} post={post} />
			))}
		</AppLayout>
	);
};

export default Home;
