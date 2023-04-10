import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Slick from 'react-slick';
import styled from 'styled-components';

const Overlay = styled.div`
	position: fixed;
	z-index: 5000;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
`;

const Header = styled.header`
	height: 44px;
	background: white;
	postion: relative;
	padding: 0;
	text-align: center;

	& h1 {
		margin: 0;
		font-size: 17px;
		color: #333;
		line-height: 44px;
	}

	& button {
		position: absolute;
		right: 0;
		top: 0;
		padding: 15px;
		line-height: 14px;
		cursor: pointer;
	}
`;

const SlickWrapper = styled.div`
	height: calc(100% - 44px);
	background: #090909;
`;

const ImgWrapper = styled.div`
	padding: 32px;
	text-align: center;

	& img {
		margin: 0 auto;
		max-height: 750px;
	}
`;

const ImagesZoom = ({ images, onClose }) => {
	const { currentSlide, setCurrentSlide } = useState(0);
	return (
		<Overlay>
			<Header>
				<h1>상세이미지</h1>
				<button onClick={onClose}>X</button>
			</Header>
			<SlickWrapper>
				<div>
					<Slick
						initialSlide={0} //시작하는 이미지의 번호
						afterChange={(slide) => setCurrentSlide(slide)}
						infinite //무한대로 되돌기
						arrows={false} // 화살표 없애기
						slidesToShow={1} // 이미지 하나씩만 보여주기
						slidesToScroll={1} // 이미지 하나씩만 넘기기
					>
						{/* Slick안에 이미지들 넣어주기 */}
						{images.map((v) => (
							<ImgWrapper key={v.src}>
								<img src={v.src} alt={v.src} />
							</ImgWrapper>
						))}
					</Slick>
				</div>
			</SlickWrapper>
		</Overlay>
	);
};

ImagesZoom.propTypes = {
	images: PropTypes.arrayOf(PropTypes.object).isRequired,
	onClose: PropTypes.func.isRequired,
};

export default ImagesZoom;
