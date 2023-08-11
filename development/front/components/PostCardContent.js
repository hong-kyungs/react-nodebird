import React from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';

const PostCardContent = ({ postData }) => (
	<div>
		{/* 해시태그 부분 알아내기 위해서 split안에 정규표현식 넣기 */}
		{postData.split(/(#[^\s#]+)/g).map((v, i) => {
			if (v.match(/(#[^\s#]+)/)) {
				return (
					<Link href={`/hashtag/${v.slice(1)}`} key={i}>
						<a>{v}</a>
					</Link>
				);
			}
			return v;
		})}
	</div>
);

PostCardContent.propTypes = {
	postData: PropTypes.string.isRequired,
};

export default PostCardContent;
