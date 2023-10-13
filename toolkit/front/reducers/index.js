const { combineReducers } = require('redux');
const userSlice = require('./user');
const postSlice = require('./post');

module.exports = combineReducers({
	user: userSlice.reducer,
	post: postSlice.reducer,
});
