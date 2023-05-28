import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { Card, Popover, Button, Avatar, List, Comment } from 'antd';
import {
	EllipsisOutlined,
	HeartOutlined,
	HeartTwoTone,
	MessageOutlined,
	RetweetOutlined,
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import PostImages from './PostImages';
import CommentForm from './CommentForm';
import PostCardContent from './PostCardContent';
import {
	LIKE_POST_REQUEST,
	UNLIKE_POST_REQUEST,
	REMOVE_POST_REQUEST,
} from '../reducers/post';
import FollowButton from './FollowButton';

const PostCard = ({ post }) => {
	const dispatch = useDispatch();
	const { removePostLoading } = useSelector((state) => state.post);
	const [commentFormOpened, setCommentFormOpened] = useState(false);
	const onLike = useCallback(() => {
		dispatch({
			type: LIKE_POST_REQUEST,
			data: post.id,
		});
	}, []);
	const onUnLike = useCallback(() => {
		dispatch({
			type: UNLIKE_POST_REQUEST,
			data: post.id,
		});
	}, []);
	const onToggleComment = useCallback(() => {
		setCommentFormOpened((prev) => !prev);
	}, []);

	const onRemovePost = useCallback(() => {
		dispatch({
			type: REMOVE_POST_REQUEST,
			data: post.id,
		});
	}, []);

	//옵셔널 체이닝
	//const id = useSelector((state) => state.user.me && state.user.me.id);를 ?.으로 줄여줄 수 있다
	//state.user.me.id가 있으면 id에 넣어주고, 없으면 undefined로 처리
	const id = useSelector((state) => state.user.me?.id);
	const liked = post.Likers.find((v) => v.id === id);

	return (
		<div style={{ marginBottom: 20 }}>
			<Card
				cover={post.Images[0] && <PostImages images={post.Images} />}
				actions={[
					<RetweetOutlined key='retweet' />,
					//좋아요 버튼
					liked ? (
						<HeartTwoTone
							key='heart'
							twoToneColor='#eb2f96'
							onClick={onUnLike}
						/>
					) : (
						<HeartOutlined key='heart' onClick={onLike} />
					),
					<MessageOutlined key='comment' onClick={onToggleComment} />,
					<Popover
						key='more'
						content={
							<Button.Group>
								{id && post.User.id === id ? (
									<>
										<Button>수정</Button>
										<Button
											type='danger'
											onClick={onRemovePost}
											loading={removePostLoading}>
											삭제
										</Button>
									</>
								) : (
									<Button>신고</Button>
								)}
							</Button.Group>
						}>
						<EllipsisOutlined />
					</Popover>,
				]}
				extra={id && <FollowButton post={post} />}>
				<Card.Meta
					avatar={<Avatar>{post.User.nickname[0]}</Avatar>}
					title={post.User.nickname}
					description={<PostCardContent postData={post.content} />}
				/>
			</Card>
			{commentFormOpened && (
				<div>
					{/* 댓글은 게시글에 속해있고 어떤 게시글에 달건지 정보가 필요하고,(게시글의 id가 필요하다) 그 아이디를 CommentForm이 받아야 하기 때문에 props로 넘겨준다 */}
					<CommentForm post={post} />
					<List
						header={`${post.Comments.length}개의 댓글`}
						itemLayout='horizontal'
						dataSource={post.Comments}
						renderItem={(item) => (
							<li>
								<Comment
									author={item.User.nickname}
									avatar={<Avatar>{item.User.nickname[0]}</Avatar>}
									content={item.content}
								/>
							</li>
						)}
					/>
				</div>
			)}
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
		CreateAT: PropTypes.string,
		Comments: PropTypes.arrayOf(PropTypes.object),
		Images: PropTypes.arrayOf(PropTypes.object),
		Likers: PropTypes.arrayOf(PropTypes.object),
	}).isRequired,
};

export default PostCard;
