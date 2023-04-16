import React, { useCallback, useEffect, useRef } from 'react';
import { Form, Input, Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { addPost } from '../reducers/post';
import useInput from '../../hooks/useInput';

const PostForm = () => {
	const { imagePaths, addPostDone } = useSelector((state) => state.post);
	const dispatch = useDispatch();
	const imageInput = useRef(); // 실제 DOM에 접근하기위해 ref 사용

	// const [text, setText] = useState('');
	// const onChangeText = useCallback((e) => {
	// 	setText(e.target.value);
	// }, []);
	//useInput사용하여 줄여주기
	const [text, onChangeText, setText] = useInput('');

	useEffect(() => {
		if (addPostDone) {
			setText('');
		}
	}, [addPostDone]);

	const onSubmit = useCallback(() => {
		dispatch(addPost(text));
		// setText(''); //게시글을 보냈는데 에러가 났다면, 글이 지워지면 안되기 때문에 여기에 위치하면 안된다.
	}, [text]);

	const onClickImageUpload = useCallback(() => {
		imageInput.current.click();
	}, [imageInput.current]);

	return (
		<Form
			style={{ margin: '10px 0 20px' }}
			encType='multipart/form-data'
			onFinish={onSubmit}>
			<Input.TextArea
				value={text}
				onChange={onChangeText}
				maxLength={140}
				placeholder='어떤 신기한 일이 있었나요?'
			/>
			<div>
				<input type='file' multiple hidden ref={imageInput} />
				{/* 이미지 업로드  버튼*/}
				<Button onClick={onClickImageUpload}>이미지 업로드</Button>
				{/* 게시글 작성 버튼 */}
				<Button type='primary' style={{ float: 'right' }} htmlType='submit'>
					짹짹
				</Button>
			</div>
			<div>
				{imagePaths.map((v) => (
					<div key={v} style={{ display: 'inline-block' }}>
						<img src={v} style={{ width: '200px' }} alt={v} />
						<div>
							<Button>제거</Button>
						</div>
					</div>
				))}
			</div>
		</Form>
	);
};

export default PostForm;
