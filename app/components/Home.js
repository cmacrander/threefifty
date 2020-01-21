// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import routes from '../routes';

type Props = {};

export default class Home extends Component<Props> {
  props: Props;

  render() {
    return (
      <div data-tid="container">
        <h2>350 Seattle Utilities</h2>
        <ul>
          <li>
            <Link to={routes.toEnterIds()}>Enter Action IDs</Link>
          </li>
          <li>
            <Link to={routes.toAddToFile()}>Add Action IDs to file</Link>
          </li>
        </ul>
      </div>
    );
  }
}
