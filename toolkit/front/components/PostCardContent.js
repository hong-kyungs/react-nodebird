import React from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';

const PostCardContent = ({ postData }) => (
	<div>
		{/* 해시태그 부분 알아내기 위해서 split안에 정규표현식 넣기 */}
		{postData.split(/(#[^\s#]+)/g).map((v, i) => {
			//해시태그가 있으면 링크로 만들어주고
			if (v.match(/(#[^\s#]+)/)) {
				return (
					<Link href={`/hashtag/${v.slice(1)}`} key={i}>
						<a>{v}</a>
					</Link>
				);
			}
			//일반적인 문자열이면 그대로 리턴
			return v;
		})}
	</div>
);

PostCardContent.propTypes = {
	postData: PropTypes.string.isRequired,
};

export default PostCardContent;
