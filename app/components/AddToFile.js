// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import routes from '../routes';
import styles from './Home.css';

type Props = {};

export default class Home extends Component<Props> {
  props: Props;

  render() {
    return (
      <div className={styles.container} data-tid="container">
        <h2>Add To File</h2>
      </div>
    );
  }
}
