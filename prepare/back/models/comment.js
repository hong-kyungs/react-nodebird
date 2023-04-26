module.exports = (sequelize, DataTypes) => {
	const Comment = sequelize.define(
		'Comment',
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

	Comment.associate = (db) => {
		db.Comment.belongsTo(db.User);
		db.Comment.belongsTo(db.Post);
	};
	return Comment;
};
