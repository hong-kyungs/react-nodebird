import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { Card, Popover, Button, Avatar } from 'antd';
import {
	EllipsisOutlined,
	HeartOutlined,
	HeartTwoTone,
	MessageOutlined,
	RetweetOutlined,
} from '@ant-design/icons';
import { useSelector } from 'react-redux';
import PostImages from './PostImages';

const PostCard = ({ post }) => {
	const [liked, setLiked] = useState(false);
	const [commentFormOpened, setCommentFormOpened] = useState(false);
	const onToggleLike = useCallback(() => {
		setLiked((prev) => !prev); //false는 true로, true는 false로 바뀐다.
	}, []);
	const onToggleComment = useCallback(() => {
		setCommentFormOpened((prev) => !prev);
	}, []);

	//옵셔널 체이닝
	//const id = useSelector((state) => state.user.me && state.user.me.id);를 ?.으로 줄여줄 수 있다
	//state.user.me.id가 있으면 id에 넣어주고, 없으면 undefined로 처리
	const id = useSelector((state) => state.user.me?.id);

	return (
		<div style={{ marginBottom: 20 }}>
			<Card
				cover={post.Images[0] && <PostImages images={post.Images} />}
				actions={[
					<RetweetOutlined key='retweet' />,
					liked ? (
						<HeartTwoTone
							key='heart'
							twoToneColor='#eb2f96'
							onClick={onToggleLike}
						/>
					) : (
						<HeartOutlined key='heart' onClick={onToggleLike} />
					),
					<MessageOutlined key='comment' onClick={onToggleComment} />,
					<Popover
						key='more'
						content={
							<Button.Group>
								{id && post.User.id === id ? (
									<>
										<Button>수정</Button>
										<Button type='danger'>삭제</Button>
									</>
								) : (
									<Button>신고</Button>
								)}
							</Button.Group>
						}>
						<EllipsisOutlined />
					</Popover>,
				]}>
				<Card.Meta
					avatar={<Avatar>{post.User.nickname[0]}</Avatar>}
					title={post.User.nickname}
					description={post.content}
				/>
			</Card>
			{commentFormOpened && <div>댓글부분</div>}
			{/* <CommentForm /> */}
			{/* <Comments /> */}
		</div>
	);
};
//
PostCard.propTypes = {
	post: PropTypes.shape({
		id: PropTypes.number,
		User: PropTypes.object,
		content: PropTypes.string,
		CreateAT: PropTypes.object,
		Comments: PropTypes.arrayOf(PropTypes.object),
		Images: PropTypes.arrayOf(PropTypes.object),
	}).isRequired,
};

export default PostCard;
