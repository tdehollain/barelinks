import { createStore, combineReducers, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunkMiddleware from 'redux-thunk';

import userReducer from '../reducers/userReducer';
import authReducer from '../reducers/authReducer';


const reducers = combineReducers({
	userReducer,
	authReducer
});

export const store = createStore(reducers, composeWithDevTools(applyMiddleware(thunkMiddleware)));