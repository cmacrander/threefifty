// @flow
import React from 'react';
import { Link } from 'react-router-dom';

import routes from '../routes';
import { Tabs, TabTitle, TabContent } from './Tabs';

type Props = {};

export default class Home extends React.Component<Props> {
  props: Props;

  render() {
    return (
      <div data-tid="container">
        <h2>Enter Ids</h2>
        <Tabs>
          <TabContent title={<>Upload spreadsheet</>}>
            <p>
              The first sheet of the file should have a column called "email",
              or a column called "action ID", or both. Capitalization doesn't
              matter.
            </p>
            <form>
              <label>
                Spreadsheet with emails/IDs:
                <input type="file" />
              </label>
              <button type="submit">Submit</button>
            </form>
          </TabContent>
          <TabContent title={<>Paste from spreadsheet</>}>
            <form>
              <p>
                Include column names when pasting. They may be either "email",
                "action ID", or both. Capitalization doesn't matter.
              </p>
              <textarea />
              <button type="submit">Submit</button>
            </form>
          </TabContent>
          <TabContent title={<>Enter individual</>}>
            <p>enter individuals</p>
          </TabContent>
        </Tabs>
        <p>New individuals recorded:</p>
        <p>Individuals updated:</p>
        <p>Exisiting individuals unchanged:</p>
        <p>Warnings:</p>
      </div>
    );
  }
}
