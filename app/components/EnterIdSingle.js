import React from 'react';
import csvtojson from 'csvtojson';

import ValidationError from '../utils/ValidationError';
import { ACTION_ID_COLUMN_NAME, EMAIL_COLUMN_NAME } from '../config';

class EnterIdSingle extends React.Component {
  constructor(props) {
    super(props);
    this.state = { email: '', id: '' };
  }

  handleChange = field => event => {
    this.setState({ [field]: event.target.value });
  };

  handleSubmit = async event => {
    event.preventDefault();
    const { onSubmit, onValidationError } = this.props;
    const { email, id } = this.state;

    try {
      onSubmit([
        {
          [EMAIL_COLUMN_NAME]: email,
          [ACTION_ID_COLUMN_NAME]: id,
        },
      ]);
    } catch (e) {
      if (e instanceof ValidationError) {
        onValidationError(e);
      } else {
        throw e;
      }
    }
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Email:
          <input
            type="email"
            value={this.state.email}
            onChange={this.handleChange('email')}
            required
          />
        </label>
        <label>
          Action ID:
          <input
            type="text"
            value={this.state.id}
            onChange={this.handleChange('id')}
            required
          />
        </label>
        <button type="submit">Submit</button>
      </form>
    );
  }
}

export default EnterIdSingle;
