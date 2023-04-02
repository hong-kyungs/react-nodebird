import React from 'react';
import Head from 'next/head';

import AppLayout from '../components/AppLayout';
import NicknameEditForm from '../components/NicknameEditForm';
import FollowList from '../components/FollowList';

const Profile = () => {
	//dummy data 만들어서 사용
	const followingList = [
		{ nickname: 'AmyCho' },
		{ nickname: 'Charlie' },
		{ nickname: 'Justin' },
	];
	const followerList = [
		{ nickname: 'AmyCho' },
		{ nickname: 'Charlie' },
		{ nickname: 'Justin' },
	];

	return (
		<>
			<Head>
				<title>내 프로필 | NodeBird</title>
			</Head>
			<AppLayout>
				<NicknameEditForm />
				<FollowList header='팔로잉 목록' data={followingList} />
				<FollowList header='팔로워 목록' data={followerList} />
			</AppLayout>
		</>
	);
};

export default Profile;
