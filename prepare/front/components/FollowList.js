import React from 'react';
import PropTypes from 'prop-types';
import { List, Button, Card } from 'antd';
import { StopOutlined } from '@ant-design/icons';

const FollowList = ({ header, data }) => {
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
					<Button>더 보기</Button>
				</div>
			}
			bordered
			dataSource={data}
			renderItem={(item) => (
				<List.Item style={{ marginTop: 20 }}>
					<Card actions={[<StopOutlined key='stop' />]}>
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
	data: PropTypes.array.isRequired,
};

export default FollowList;
