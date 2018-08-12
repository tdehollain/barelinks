import { createStore, combineReducers, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunkMiddleware from 'redux-thunk';

import userReducer from '../reducers/userReducer';
import authReducer from '../reducers/authReducer';
import listReducer from '../reducers/listReducer';


const reducers = combineReducers({
	userReducer,
	authReducer,
	listReducer
});

export const store = createStore(reducers, composeWithDevTools(applyMiddleware(thunkMiddleware)));