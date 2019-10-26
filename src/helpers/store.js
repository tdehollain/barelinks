import { createStore, combineReducers, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunkMiddleware from 'redux-thunk';

import userReducer from '../reducers/userReducer';
import authReducer from '../reducers/authReducer';
import listReducer from '../reducers/listReducer';
import addTagModalReducer from '../reducers/addTagModalReducer';


const reducers = combineReducers({
	userReducer,
	authReducer,
	listReducer,
	addTagModalReducer
});

export const store = createStore(reducers, composeWithDevTools(applyMiddleware(thunkMiddleware)));