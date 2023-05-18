import React, { useCallback, useEffect, useState } from 'react';
import AppLayout from '../components/AppLayout';
import Head from 'next/head';
import { Checkbox, Form, Input, Button } from 'antd';
import styled from 'styled-components';
import Router from 'next/router';

import useInput from '../../hooks/useInput';
import { useDispatch, useSelector } from 'react-redux';
import { SIGN_UP_FAILURE, SIGN_UP_REQUEST } from '../reducers/user';

const ErrorMessage = styled.div`
	color: red;
`;

const Signup = () => {
	const dispatch = useDispatch();
	const { signUpLoading, signUpDone, signUpError, me } = useSelector(
		(state) => state.user
	);

	//로그인에 성공하면 회원가입 페이지에서 나가기
	useEffect(() => {
		if (me && me.id) {
			Router.replace('/');
		}
	}, [me && me.id]);

	useEffect(() => {
		if (signUpDone) {
			//회원가입이 성공하면 메인페이지로 보내기
			Router.replace('/');
		}
	}, [signUpDone]);

	useEffect(() => {
		if (signUpError) {
			alert(signUpError);
		}
	}, [signUpError]);

	const [email, onChangeEmail] = useInput('');
	const [nickname, onChangeNickname] = useInput('');
	const [password, onChangePassword] = useInput('');

	const [passwordCheck, setPasswordCheck] = useState('');
	const [passwordError, setPasswordError] = useState(false);
	const onChangePasswordCheck = useCallback(
		(e) => {
			setPasswordCheck(e.target.value);
			setPasswordError(e.target.value !== password);
		},
		[password]
	);

	const [term, setTerm] = useState('');
	const [termError, setTermError] = useState(false);
	const onChangeTerm = useCallback((e) => {
		setTerm(e.target.checked);
		setTermError(false);
	}, []);

	/* 	
	const [id, setId] = useState('');
	const onChangeId = useCallback((e) => {
		setId(e.target.value);
	}, []);
	const [nickname, setNickname] = useState('');
	const onChangeNickname = useCallback((e) => {
		setNickname(e.target.value);
	}, []);
	const [password, setPassword] = useState('');
	const onChangePassword = useCallback((e) => {
		setPassword(e.target.value);
	}, []);
	*/

	const onSubmit = useCallback(() => {
		if (password !== passwordCheck) {
			return setPasswordError(true);
		}
		if (!term) {
			return setTermError(true);
		}
		console.log(email, nickname, password);
		dispatch({
			type: SIGN_UP_REQUEST,
			data: { email, nickname, password },
		});
	}, [email, password, passwordCheck, term]);

	return (
		<>
			<Head>
				<title>회원가입 | NodeBird</title>
			</Head>
			<AppLayout>
				<Form onFinish={onSubmit}>
					<div>
						<label htmlFor='user-email'>이메일</label>
						<br />
						<Input
							name='user-email'
							type='email'
							value={email}
							required
							onChange={onChangeEmail}
						/>
					</div>
					<div>
						<label htmlFor='user-nickname'>닉네임</label>
						<br />
						<Input
							name='user-nickname'
							value={nickname}
							required
							onChange={onChangeNickname}
						/>
					</div>
					<div>
						<label htmlFor='user-password'>비밀번호</label>
						<br />
						<Input
							name='user-password'
							type='password'
							value={password}
							required
							onChange={onChangePassword}
						/>
					</div>
					<div>
						<label htmlFor='user-password-check'>비밀번호체크</label>
						<br />
						<Input
							name='user-password-check'
							type='password'
							value={passwordCheck}
							required
							onChange={onChangePasswordCheck}
						/>
						{passwordError && (
							<ErrorMessage>비밀번호가 일치하지 않습니다</ErrorMessage>
						)}
					</div>
					<div>
						<Checkbox name='user-term' checked={term} onChange={onChangeTerm}>
							모든 항목에 동의합니다.
						</Checkbox>
						{termError && (
							<ErrorMessage>약관에 동의하셔야 합니다.</ErrorMessage>
						)}
					</div>
					<div style={{ marginTop: 10 }}>
						<Button type='primary' htmlType='submit' loading={signUpLoading}>
							가입하기
						</Button>
					</div>
				</Form>
			</AppLayout>
		</>
	);
};

export default Signup;
