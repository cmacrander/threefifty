// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { submitPasswordAction } from '../actions/auth';
import bindActions from '../utils/bindActions';
import routes from '../routes';

type Props = {};

class Home extends Component<Props> {
  props: Props;

  constructor(props) {
    super(props);

    this.state = { password: '' };
  }

  handleChange = field => event => {
    this.setState({ [field]: event.target.value });
  };

  handleSubmit = event => {
    event.preventDefault();

    this.props.submitPasswordAction(this.state.password);
  };

  render() {
    return (
      <div data-tid="container">
        <h1>350 Seattle Utilities</h1>
        <ul>
          <li>
            <Link to={routes.toEnterIds()}>Enter Action IDs</Link>
          </li>
          <li>
            <Link to={routes.toAddToFile()}>Add Action IDs to file</Link>
          </li>
        </ul>
        <form onSubmit={this.handleSubmit}>
          <label>
            Enter password:
            <input
              type="password"
              name="password"
              value={this.state.password}
              onChange={this.handleChange('password')}
            />
          </label>
          <button type="submit">Submit</button>
        </form>
        <p>Your current password is: {this.props.password}</p>
      </div>
    );
  }
}

export default connect(
  (state, props) => ({
    password: state.auth.password,
  }),
  bindActions({ submitPasswordAction }),
)(Home);
