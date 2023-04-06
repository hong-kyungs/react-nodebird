//_app.js는 페이지들의 공통되는 부분을 처리하는 공간.
import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import 'antd/dist/antd.css';
import wrapper from '../store/configureStore';

const NodeBird = ({ Component }) => {
	return (
		<>
			<Head>
				<meta charSet='UTF-8' />
				<title>NodeBird</title>
			</Head>
			<Component />
		</>
	);
};

NodeBird.PropTypes = {
	Component: PropTypes.elementType.isRequired,
};

export default wrapper.withRedux(NodeBird);
