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

	Post.associate = (db) => {
		db.Post.belongsTo(db.User);
		db.Post.hasMany(db.Comment);
		db.Post.hasMany(db.Image);
		db.Post.belongsToMany(db.Hashtag, { through: 'PostHashtag' });
		//Likers는 게시글에 좋아요를 누른 사람들.
		db.Post.belongsToMany(db.User, { through: 'Like', as: 'Likers' });
		//리트윗한 게시글
		db.Post.belongsTo(db.Post, { as: 'Retweet' });
	};
	return Post;
};
