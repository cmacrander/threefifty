// @flow
import * as React from 'react';
import styled, { css } from 'styled-components';

const borderColor = 'rgb(220, 222, 210)';

const BorderContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const BorderRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  height: 10px;
`;

const Square = styled.div`
  width: 10px;
  height: 10px;
  border: 1px solid ${borderColor};
`;

const MainContainer = styled.div`
  flex-grow: 1;
  height: 100%;
  border: 1px solid ${borderColor};
  margin: 0 10px;
  padding: 20px;
`;

type Props = {
  children: React.Node,
};

export default class App extends React.Component<Props> {
  props: Props;

  render() {
    const { children } = this.props;
    return (
      <>
        <BorderContainer>
          <BorderRow>
            <Square />
            {/* <RowFiller /> */}
            <Square />
          </BorderRow>
          <MainContainer>{children}</MainContainer>
          <BorderRow>
            <Square />
            {/* <RowFiller /> */}
            <Square />
          </BorderRow>
        </BorderContainer>
      </>
    );
  }
}
