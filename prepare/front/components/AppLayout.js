import React from 'react';

import PropTypes from 'prop-types';
import Link from 'next/link';
import { Menu, Input, Row, Col } from 'antd';
import styled, { createGlobalStyle } from 'styled-components';
import { useSelector } from 'react-redux';

import UserProfile from './UserProfile';
import LoginForm from './LoginForm';

const SearchInput = styled(Input.Search)`
	vertical-align: middle;
`;

const Global = createGlobalStyle`
	.ant-row{
		margin-right: 0 !important;
		margin-left: 0 !important;
	}
	.ant-col:first-child{
		padding-left: 0 !important;
	}
	.ant-col:last-child{
		padding-right: 0 !important;
	}
`;

const AppLayout = ({ children }) => {
	const { me } = useSelector((state) => state.user);
	return (
		<div>
			<Global />
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
						{/* me, 내정보가 있으면 UserProfile, 없으면 LoginForm */}
						{me ? <UserProfile /> : <LoginForm />}
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
		</div>
	);
};

AppLayout.propTypes = {
	children: PropTypes.node.isRequired,
};

export default AppLayout;
