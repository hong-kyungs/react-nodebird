import React, { useEffect, useState, useCallback } from 'react';
import Head from 'next/head';
import Router from 'next/router';
import axios from 'axios';
import { END } from 'redux-saga';
import useSWR from 'swr';

import AppLayout from '../components/AppLayout';
import NicknameEditForm from '../components/NicknameEditForm';
import FollowList from '../components/FollowList';
import { useSelector } from 'react-redux';
import wrapper from '../store/configureStore';
import { loadMyInfo } from '../reducers/userSlice';

//fetcher는 이 주소를 실제로 어떻게 가져올것인지 넣어주기. - axios.get
const fetcher = (url) =>
	axios.get(url, { withCredentials: true }).then((result) => result.data);

const Profile = () => {
	const { me } = useSelector((state) => state.user);
	const [followingsLimit, setFollowingsLimit] = useState(3);
	const [followersLimit, setFollowersLimit] = useState(3);

	const { data: followersData, error: followerError } = useSWR(
		`http://localhost:3065/user/followers?limit=${followersLimit}`,
		fetcher
	);
	const { data: follwingsData, error: followingError } = useSWR(
		`http://localhost:3065/user/followings?limit=${followingsLimit}`,
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

	//더보기 버튼을 누를때마다 limit을 3씩 올려줘서 3명씩 더 보이게하기.
	const loadMoreFollowers = useCallback(() => {
		setFollowersLimit((prev) => prev + 3);
	}, []);
	const loadMoreFollowings = useCallback(() => {
		setFollowingsLimit((prev) => prev + 3);
	}, []);

	//return이 있으면 항상 hooks보다 아래에 있어야한다.
	//return이 되면 아래에 있는 hooks는 동작하지 않는다.
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
			store.dispatch(loadMyInfo());
			store.dispatch(END);
			await store.sagaTask.toPromise();
		}
);

export default Profile;
