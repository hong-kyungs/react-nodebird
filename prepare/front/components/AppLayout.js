import React, { useState } from 'react';

import PropTypes from 'prop-types';
import Link from 'next/link';
import { Menu, Input, Row, Col } from 'antd';
import styled from 'styled-components';

import UserProfile from './UserProfile';
import LoginForm from './LoginForm';

const SearchInput = styled(Input.Search)`
	vertical-align: middle;
`;

const AppLayout = ({ children }) => {
	//서버없이 로그인 유무를 확인할 수 없으므로, dummy data를 이용한다.
	const [isLoggedIn, setIsloggedIn] = useState(false);
	return (
		<div>
			<Menu mode='horizontal'>
				<Menu.Item>
					<Link href='/'>
						<a>노드버드</a>
					</Link>
				</Menu.Item>
				<Menu.Item>
					<Link href='/profile'>
						<a>프로필</a>
					</Link>
				</Menu.Item>
				<Menu.Item>
					<SearchInput enterButton />
				</Menu.Item>
				<Menu.Item>
					<Link href='/signup'>
						<a>회원가입</a>
					</Link>
				</Menu.Item>
			</Menu>
			<Row gutter={8}>
				<Col xs={24} md={6}>
					{isLoggedIn ? (
						<UserProfile setIsloggedIn={setIsloggedIn} />
					) : (
						<LoginForm setIsloggedIn={setIsloggedIn} />
					)}
				</Col>
				<Col xs={24} md={12}>
					{children}
				</Col>
				<Col xs={24} md={6}>
					{/* 
					target='_blank'로 새창에서 띄우는데, 이것은 보안위협이 있으므로 반드시 rel='...'을 추가한다.
					*/}
					<a
						href='https://hong-kyungs.github.io/'
						target='_blank'
						rel='noreferrer noopener'>
						My Blog
					</a>
				</Col>
			</Row>
		</div>
	);
};

AppLayout.propTypes = {
	children: PropTypes.node.isRequired,
};

export default AppLayout;
