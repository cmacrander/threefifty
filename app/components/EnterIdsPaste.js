import React from 'react';
import csvtojson from 'csvtojson';

import ValidationError from '../utils/ValidationError';

class EnterIdsPaste extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: '' };
  }

  handleChange = event => {
    this.setState({ value: event.target.value });
  };

  handleSubmit = async event => {
    event.preventDefault();
    const { onSubmit, onValidationError } = this.props;
    const { value } = this.state;

    try {
      const textData = await csvtojson({ delimiter: '\t' }).fromString(value);
      onSubmit(textData);
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
        <p>
          Include column names when pasting. They may be either "email", "action
          ID", or both. Capitalization doesn't matter.
        </p>
        <textarea value={this.state.value} onChange={this.handleChange} />
        <button type="submit">Submit</button>
      </form>
    );
  }
}

export default EnterIdsPaste;
