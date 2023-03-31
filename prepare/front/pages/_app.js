import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import 'antd/dist/antd.css';

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
	Component: PropTypes.elementType.isrequired,
};

export default NodeBird;
