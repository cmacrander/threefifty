import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Switch, Route } from 'react-router';

import AddToFile from './containers/AddToFile';
import App from './containers/App';
import EnterIds from './containers/EnterIds';
import HomePage from './containers/HomePage';
import routes from './routes';

const NavBar = styled.div`
  padding: 5px 10px;
`;

export default () => (
  <App>
    <NavBar>
      <Link to={routes.toHome()}>Home</Link>
    </NavBar>
    <Switch>
      <Route path={routes.toHome()} component={HomePage} exact />
      <Route path={routes.toEnterIds()} component={EnterIds} />
      <Route path={routes.toAddToFile()} component={AddToFile} />
    </Switch>
  </App>
);
