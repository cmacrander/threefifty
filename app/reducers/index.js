// @flow
import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import type { HashHistory } from 'history';

import { submitPasswordType } from '../actions/auth';
import createReducer from './createReducer';

export default function createRootReducer(history: HashHistory) {
  return combineReducers<{}, *>({
    router: connectRouter(history),
    auth: createReducer(
      {
        password: null,
        passwordIsValid: null,
      },
      {
        [submitPasswordType]: (state, action) => ({
          password: action.password,
          passwordIsValid: action.passwordIsValid,
        }),
      },
    ),
  });
}
