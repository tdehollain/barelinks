import { createStore, combineReducers, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunkMiddleware from 'redux-thunk';

import userReducer from '../reducers/userReducer';

const reducers = combineReducers({
  userReducer
});

export const store = createStore(reducers, composeWithDevTools(applyMiddleware(thunkMiddleware)));
