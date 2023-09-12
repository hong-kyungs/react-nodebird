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
import Link from 'next/link';
import moment from 'moment';

import PostImages from './PostImages';
import CommentForm from './CommentForm';
import PostCardContent from './PostCardContent';
import {
	LIKE_POST_REQUEST,
	UNLIKE_POST_REQUEST,
	REMOVE_POST_REQUEST,
	RETWEET_REQUEST,
	UPDATE_POST_REQUEST,
} from '../reducers/post';
import FollowButton from './FollowButton';

moment.locale('ko'); // ko로 한글로 바꿔준다

const PostCard = ({ post }) => {
	const dispatch = useDispatch();
	const { removePostLoading } = useSelector((state) => state.post);
	const [commentFormOpened, setCommentFormOpened] = useState(false);
	//옵셔널 체이닝
	//const id = useSelector((state) => state.user.me && state.user.me.id);를 ?.으로 줄여줄 수 있다
	//state.user.me.id가 있으면 id에 넣어주고, 없으면 undefined로 처리
	const id = useSelector((state) => state.user.me?.id);
	const [editMode, setEditMode] = useState(false);

	const onLike = useCallback(() => {
		if (!id) {
			return alert('로그인이 필요합니다.');
		}
		return dispatch({
			type: LIKE_POST_REQUEST,
			data: post.id,
		});
	}, [id]);
	const onUnLike = useCallback(() => {
		if (!id) {
			return alert('로그인이 필요합니다.');
		}
		return dispatch({
			type: UNLIKE_POST_REQUEST,
			data: post.id,
		});
	}, [id]);
	const onToggleComment = useCallback(() => {
		setCommentFormOpened((prev) => !prev);
	}, []);

	const onClickUpdate = useCallback(() => {
		setEditMode(true);
	}, []);

	const onCancelUpdate = useCallback(() => {
		setEditMode(false);
	}, []);

	//고차함수를 만들어 자식으로부터 editText를 전달받아서 실행
	const onChangePost = useCallback(
		(editText) => () => {
			dispatch({
				type: UPDATE_POST_REQUEST,
				data: {
					PostId: post.id,
					content: editText,
				},
			});
			setEditMode(false);
		},
		[post]
	);

	const onRemovePost = useCallback(() => {
		if (!id) {
			return alert('로그인이 필요합니다.');
		}
		return dispatch({
			type: REMOVE_POST_REQUEST,
			data: post.id,
		});
	}, [id]);

	const onRetweet = useCallback(() => {
		if (!id) {
			return alert('로그인이 필요합니다.');
		}
		return dispatch({
			type: RETWEET_REQUEST,
			data: post.id,
		});
	}, [id]);

	const liked = post.Likers.find((v) => v.id === id);

	return (
		<div style={{ marginBottom: 20 }}>
			<Card
				cover={post.Images[0] && <PostImages images={post.Images} />}
				actions={[
					<RetweetOutlined key='retweet' onClick={onRetweet} />,
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
										{!post.RetweetId && (
											<Button onClick={onClickUpdate}>수정</Button>
										)}
										<Button
											type='danger'
											onClick={onRemovePost}
											loading={removePostLoading}
										>
											삭제
										</Button>
									</>
								) : (
									<Button>신고</Button>
								)}
							</Button.Group>
						}
					>
						<EllipsisOutlined />
					</Popover>,
				]}
				title={
					post.RetweetId ? `${post.User.nickname}님이 리트윗 하셨습니다.` : null
				}
				extra={id && <FollowButton post={post} />}
			>
				{/* 리트윗경우에는 Card안에 Card를 넣어준다. */}
				{post.RetweetId && post.Retweet ? (
					<Card
						cover={
							post.Retweet.Images[0] && (
								<PostImages images={post.Retweet.Images} />
							)
						}
					>
						<div style={{ float: 'right' }}>
							{moment(post.createdAt).format('YYYY. MM. DD')}
						</div>
						<Card.Meta
							avatar={<Avatar>{post.Retweet.User.nickname[0]}</Avatar>}
							title={post.Retweet.User.nickname}
							description={
								<PostCardContent
									postData={post.Retweet.content}
									onChangePost={onChangePost}
									onCancelUpdate={onCancelUpdate}
								/>
							}
						/>
					</Card>
				) : (
					<>
						<div style={{ float: 'right' }}>
							{moment(post.createdAt).format('YYYY. MM. DD')}
						</div>
						<Card.Meta
							avatar={
								<Link href={`/user/${post.User.id}`}>
									<a>
										<Avatar>{post.User.nickname[0]}</Avatar>
									</a>
								</Link>
							}
							title={post.User.nickname}
							//editMode가 true면 게시글 수정하는 textarea 보여주고 false면 기존 게시글 보여주기
							description={
								<PostCardContent
									editMode={editMode}
									onChangePost={onChangePost}
									onCancelUpdate={onCancelUpdate}
									postData={post.content}
								/>
							}
						/>
					</>
				)}
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
									avatar={
										<Link href={`/user/${item.User.id}`}>
											<a>
												<Avatar>{item.User.nickname[0]}</Avatar>
											</a>
										</Link>
									}
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
		RetweetId: PropTypes.number,
		Retweet: PropTypes.objectOf(PropTypes.any),
	}).isRequired,
};

export default PostCard;
