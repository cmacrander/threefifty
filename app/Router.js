import React from 'react';
import AddToFile from './containers/AddToFile';
import App from './containers/App';
import EnterIds from './containers/EnterIds';
import HomePage from './containers/HomePage';
import routes from './routes';
import { Link } from 'react-router-dom';
import { Switch, Route } from 'react-router';

export default () => (
  <App>
    <div><Link to={routes.toHome()}>Home</Link></div>
    <Switch>
      <Route path={routes.toHome()} component={HomePage} exact />
      <Route path={routes.toEnterIds()} component={EnterIds} />
      <Route path={routes.toAddToFile()} component={AddToFile} />
    </Switch>
  </App>
);
