import React, { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { Button, Input } from 'antd';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

const { TextArea } = Input;
const PostCardContent = ({
	postData,
	editMode,
	onChangePost,
	onCancelUpdate,
}) => {
	const { updatePostLoading, updatePostDone } = useSelector(
		(state) => state.post
	);
	const [editText, setEditText] = useState(postData);

	useEffect(() => {
		if (updatePostDone) {
			onCancelUpdate();
			console.log('update');
		}
	}, [updatePostDone]);

	const onChangeText = useCallback((e) => {
		setEditText(e.target.value);
	});

	const onClickCancel = useCallback(() => {
		setEditText(postData);
		onCancelUpdate();
	});

	return (
		// 첫 번째 게시글 #해시태그 #해시태그
		<div>
			{editMode ? (
				<>
					<TextArea value={editText} onChange={onChangeText} />
					<Button.Group>
						<Button
							loading={updatePostLoading}
							onClick={onChangePost(editText)}
						>
							수정
						</Button>
						<Button type='danger' onClick={onClickCancel}>
							취소
						</Button>
					</Button.Group>
				</>
			) : (
				//해시태그 부분 알아내기 위해서 split안에 정규표현식 넣기
				postData.split(/(#[^\s#]+)/g).map((v, i) => {
					if (v.match(/(#[^\s#]+)/)) {
						return (
							<Link href={`/hashtag/${v.slice(1)}`} prefetch={false} key={i}>
								<a>{v}</a>
							</Link>
						);
					}
					return v;
				})
			)}
		</div>
	);
};

PostCardContent.propTypes = {
	postData: PropTypes.string.isRequired,
	editMode: PropTypes.bool,
	onChangePost: PropTypes.func.isRequired,
	onCancelUpdate: PropTypes.func.isRequired,
};

//리트윗에는 editMode 속성이 없으므로 기본값 false를 붙여준다
PostCardContent.defaultProps = {
	editMode: false,
};

export default PostCardContent;
