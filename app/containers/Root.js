// @flow
import React from 'react';
import Router from '../Router';
import type { Store } from '../reducers/types';
import { ConnectedRouter } from 'connected-react-router';
import { hot } from 'react-hot-loader/root';
import { Provider } from 'react-redux';

type Props = {
  store: Store,
  history: {}
};

const Root = ({ store, history }: Props) => (
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <Router />
    </ConnectedRouter>
  </Provider>
);

export default hot(Root);
