import React from 'react';
import PropTypes from 'prop-types';
import { List, Button, Card } from 'antd';
import { StopOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { unfollow, removeFollower } from '../reducers/userSlice';

const FollowList = ({ header, data, onClickMore, loading }) => {
	const dispatch = useDispatch();

	//반복문데 대한 데이터는 함수로 보낼때는 고차함수를 사용, item.id가 id자리에 들어간다.
	const onCancel = (id) => () => {
		//팔로잉 카테고리에서 클릭되면 언팔로우, 팔로워에서 클릭되면 팔로워 차단(삭제)
		if (header === '팔로잉') {
			dispatch(unfollow(id));
		}
		dispatch(removeFollower(id));
	};
	// 편의상 style을 객채로 코딩해서 다시 전체적으로 다시 리렌더링이 되기 때문에,
	// styled-components나 useMemo로 최적화를 해줘야한다.
	return (
		<List
			style={{ marginBottom: 20 }}
			grid={{ gutter: 4, sm: 2, md: 3, lg: 3 }}
			size='small'
			header={<div>{header}</div>}
			loadMore={
				<div style={{ textAlign: 'center', margin: '10px 0' }}>
					<Button onClick={onClickMore} loading={loading}>
						더 보기
					</Button>
				</div>
			}
			bordered
			dataSource={data}
			renderItem={(item) => (
				<List.Item style={{ marginTop: 20 }}>
					<Card
						actions={[<StopOutlined key='stop' onClick={onCancel(item.id)} />]}
					>
						<Card.Meta description={item.nickname} />
					</Card>
				</List.Item>
			)}
		/>
	);
};

//props로 넘겨받는게 있다면 반드시 PropTypes로 점검해주기 - 서비스의 성능이 높아진다.
FollowList.propTypes = {
	header: PropTypes.string.isRequired,
	data: PropTypes.array,
	onClickMore: PropTypes.func.isRequired,
	loading: PropTypes.bool.isRequired,
};

export default FollowList;
