// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { submitPasswordAction } from '../actions/auth';
import bindActions from '../utils/bindActions';
import routes from '../routes';

import Button from './Button';
import Input from './Input';

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

    const { submitPasswordAction } = this.props;
    const { password } = this.state;

    submitPasswordAction(password);
  };

  render() {
    const { pwd, passwordInput } = this.state;

    return (
      <div data-tid="container">
        <h1>350 Seattle Utilities</h1>
        {pwd ? (
          <ul>
            <li>
              <Link to={routes.toEnterIds()}>Enter Action IDs</Link>
            </li>
            <li>
              <Link to={routes.toAddToFile()}>Add Action IDs to file</Link>
            </li>
          </ul>
        ) : (
          <form onSubmit={this.handleSubmit}>
            <p>
              Please enter a password to continue, to protect data stored by
              this app.
            </p>
            <p>
              <Input
                type="password"
                value={passwordInput}
                onChange={this.handleChange('passwordInput')}
                required
              />
            </p>
            <p>
              <Button type="submit">Submit</Button>
            </p>
          </form>
        )}
      </div>
    );
  }
}

export default connect(
  state => ({
    password: state.auth.password,
  }),
  bindActions({ submitPasswordAction }),
)(Home);
