import React, { useEffect, useState, useCallback } from 'react';
import Head from 'next/head';
import Router from 'next/router';
import axios from 'axios';
import { END } from 'redux-saga';
import useSWR from 'swr';

import AppLayout from '../components/AppLayout';
import NicknameEditForm from '../components/NicknameEditForm';
import FollowList from '../components/FollowList';
import { useDispatch, useSelector } from 'react-redux';
import {
	LOAD_FOLLOWERS_REQUEST,
	LOAD_FOLLOWINGS_REQUEST,
	LOAD_MY_INFO_REQUEST,
} from '../reducers/user';
import wrapper from '../store/configureStore';

const Profile = () => {
	const dispatch = useDispatch();
	const { me } = useSelector((state) => state.user);

	const [followingsLimit, setFollowingsLimit] = useState(3);
	const [followersLimit, setFollowersLimit] = useState(3);

	const fetcher = (url) =>
		axios.get(url, { withCredentials: true }).then((result) => result.data);

	const { data: followersData, error: followerError } = useSWR(
		`http://localhost:3065/user/followers`,
		fetcher
	);
	const { data: follwingsData, error: followingError } = useSWR(
		`http://localhost:3065/user/followings`,
		fetcher
	);

	//로그아웃 할 경우 - 메인페이지로 보내기
	useEffect(() => {
		if (!(me && me.id)) {
			Router.push('/');
		}
	}, [me && me.id]);

	//로그인 하지 않으면, 프로필에 아무일도 일어나지 않게하기
	if (!me) {
		return '내 정보 로딩중...';
	}

	const loadMoreFollowers = useCallback(() => {
		setFollowersLimit((prev) => prev + 3);
	}, []);

	const loadMoreFollowings = useCallback(() => {
		setFollowingsLimit((prev) => prev + 3);
	}, []);

	if (followerError || followingError) {
		console.error(followerError || followingError);
		return <div>팔로잉/팔로워 로딩 중 에러가 발생합니다.</div>;
	}

	return (
		<>
			<Head>
				<title>내 프로필 | NodeBird</title>
			</Head>
			<AppLayout>
				<NicknameEditForm />
				<FollowList
					header='팔로잉'
					data={follwingsData}
					onClickMore={loadMoreFollowings}
					loading={!follwingsData && !followingError}
				/>
				<FollowList
					header='팔로워'
					data={followersData}
					onClickMore={loadMoreFollowers}
					loading={!followersData && !followerError}
				/>
			</AppLayout>
		</>
	);
};

export const getServerSideProps = wrapper.getServerSideProps(
	(store) =>
		async ({ req }) => {
			console.log('getServerSideProps start');
			console.log(req.headers);
			const cookie = req ? req.headers.cookie : '';
			axios.defaults.headers.Cookie = '';
			if (req && cookie) {
				axios.defaults.headers.Cookie = cookie;
			}
			store.dispatch({
				type: LOAD_MY_INFO_REQUEST,
			});
			store.dispatch(END);
			await store.sagaTask.toPromise();
		}
);

export default Profile;
