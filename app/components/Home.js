// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import bindActions from '../utils/bindActions';
import Db, { PasswordInvalidError } from '../services/Db';
import routes from '../routes';
import { checkPasswordAction, resetPasswordAction } from '../actions/auth';

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

  handlePasswordSubmit = event => {
    event.preventDefault();

    const { checkPasswordAction } = this.props;
    const { password } = this.state;

    checkPasswordAction(password);
  };

  handleClearAndReset = async event => {
    event.preventDefault();

    const confirmed = confirm(
      `Are you sure you want to DELETE the whole database and ` +
        `reset the password?`,
    );
    if (confirmed) {
      const { password } = this.state;
      const { resetPasswordAction } = this.props;
      resetPasswordAction(password);
    }
  };

  render() {
    const { password: storePassword, passwordIsValid } = this.props;
    const { password: formPassword } = this.state;

    return (
      <div data-tid="container">
        <h1>350 Seattle Utilities</h1>
        {passwordIsValid ? (
          <ul>
            <li>
              <Link to={routes.toEnterIds()}>Enter Action IDs</Link>
            </li>
            <li>
              <Link to={routes.toAddToFile()}>Add Action IDs to file</Link>
            </li>
          </ul>
        ) : (
          <>
            <form onSubmit={this.handlePasswordSubmit}>
              <p>
                Please enter a password to continue, to protect data stored by
                this app.
              </p>
              <p>
                <Input
                  type="password"
                  placeholder="Enter database password"
                  value={formPassword}
                  onChange={this.handleChange('password')}
                  required
                  style={{ minWidth: '200px', width: '40vw' }}
                />
              </p>
              <p>
                <Button type="submit" disabled={!formPassword}>
                  Open database
                </Button>
              </p>
              <p>
                <Button
                  type="button"
                  danger
                  onClick={this.handleClearAndReset}
                  disabled={!formPassword}
                >
                  Clear database and reset password.
                </Button>
              </p>
              {passwordIsValid === false && (
                <InfoBox>Incorrect password.</InfoBox>
              )}
            </form>
          </>
        )}
      </div>
    );
  }
}

export default connect(
  state => ({
    passwordIsValid: state.auth.passwordIsValid,
    password: state.auth.password,
  }),
  bindActions({ checkPasswordAction, resetPasswordAction }),
)(Home);
