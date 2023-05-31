import React, { useEffect } from 'react';
import Head from 'next/head';
import Router from 'next/router';

import AppLayout from '../components/AppLayout';
import NicknameEditForm from '../components/NicknameEditForm';
import FollowList from '../components/FollowList';
import { useDispatch, useSelector } from 'react-redux';
import {
	LOAD_FOLLOWERS_REQUEST,
	LOAD_FOLLOWINGS_REQUEST,
} from '../reducers/user';

const Profile = () => {
	const dispatch = useDispatch();
	const { me } = useSelector((state) => state.user);

	//프로필 페이지로 이동시 바로 팔로우, 팔로잉 목록 불러오기
	useEffect(() => {
		dispatch({
			type: LOAD_FOLLOWERS_REQUEST,
		});
		dispatch({
			type: LOAD_FOLLOWINGS_REQUEST,
		});
	}, []);

	//로그아웃 할 경우 - 메인페이지로 보내기
	useEffect(() => {
		if (!(me && me.id)) {
			Router.push('/');
		}
	}, [me && me.id]);

	//로그인 하지 않으면, 프로필에 아무일도 일어나지 않게하기
	if (!me) {
		return null;
	}
	return (
		<>
			<Head>
				<title>내 프로필 | NodeBird</title>
			</Head>
			<AppLayout>
				<NicknameEditForm />
				<FollowList header='팔로잉' data={me.Followings} />
				<FollowList header='팔로워' data={me.Followers} />
			</AppLayout>
		</>
	);
};

export default Profile;
