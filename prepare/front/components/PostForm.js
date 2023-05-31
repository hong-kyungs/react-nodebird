import React, { useCallback, useEffect, useRef } from 'react';
import { Form, Input, Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { addPost, UPLOAD_IMAGES_REQUEST } from '../reducers/post';
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

	const onChangeImages = useCallback((e) => {
		console.log('images', e.target.files); // e.target.files안에 선택한 정보들이 들어있다.
		const imageFormData = new FormData(); // formData로 하면  multipart 형식으로 서버에 보낼 수 있다. multipart형식으로 보내야 multer가 처리한다.
		//e.target.files가 유사배열로 배열모양을 띄는 객체이다. [].forEach로 배열에 forEach 메서드를 빌려쓴다.
		[].forEach.call(e.target.files, (f) => {
			imageFormData.append('image', f);
		});
		dispatch({
			type: UPLOAD_IMAGES_REQUEST,
			data: imageFormData,
		});
	});

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
				<input
					type='file'
					name='image'
					multiple
					hidden
					ref={imageInput}
					onChange={onChangeImages}
				/>
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
