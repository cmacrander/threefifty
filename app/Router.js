import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
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

const Router = ({ location, password }) => (
  <App>
    <NavBar>
      {location.pathname != '/' && <Link to={routes.toHome()}>Home</Link>}
    </NavBar>
    {password ? (
      <Switch>
        <Route path={routes.toHome()} component={HomePage} exact />
        <Route path={routes.toEnterIds()} component={EnterIds} />
        <Route path={routes.toAddToFile()} component={AddToFile} />
      </Switch>
    ) : (
      <Route path={'/'} component={HomePage} />
    )}
  </App>
);

const mapStateToProps = state => ({
  location: state.router.location,
  password: state.auth.password,
});

export default connect(mapStateToProps)(Router);
