module.exports = (sequelize, DataTypes) => {
	const Post = sequelize.define(
		'Post',
		{
			content: {
				type: DataTypes.TEXT, //TEXT를 넣으면 글자 무제한
				allowNull: false,
			},
		},
		{
			charset: 'utf8mb4',
			collate: 'utf8mb4_general_ci', // 한글+이모티콘 저장
		}
	);

	Post.associate = (db) => {};
	return Post;
};
