import React from 'react';

import Button from './Button';
import Input from './Input';
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
    const { email, id } = this.state;

    return (
      <form onSubmit={this.handleSubmit}>
        <p>
          <label>
            Email:
            <Input
              type="email"
              value={email}
              onChange={this.handleChange('email')}
              required
            />
          </label>
        </p>
        <p>
          <label>
            Action ID:
            <Input
              type="text"
              value={id}
              onChange={this.handleChange('id')}
              required
            />
          </label>
        </p>
        <p>
          <Button type="submit">Submit</Button>
        </p>
      </form>
    );
  }
}

export default EnterIdSingle;
