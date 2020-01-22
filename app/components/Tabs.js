import React, { useState } from 'react';
import noop from 'lodash/noop';
import styled, { css } from 'styled-components';

export const Tabs = ({ children, onChange = noop }) => {
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  return (
    <>
      <div>
        {React.Children.map(children, (child, tabIndex) => {
          return (
            <TabTitle
              active={tabIndex === activeTabIndex}
              onClick={event => {
                setActiveTabIndex(tabIndex);
                onChange(event);
              }}
            >
              {child.props.title}
            </TabTitle>
          );
        })}
      </div>
      {React.Children.map(children, (child, tabIndex) =>
        activeTabIndex === tabIndex ? child : null,
      )}
    </>
  );
};

export const TabTitle = styled.span`
  display: inline-block;
  padding: 5px 8px;
  background-color: #eee;
  border: 1px solid #777;
  border-radius: 3px;
  margin: 0 1px -3px 1px;
  cursor: pointer;

  ${props =>
    props.active &&
    css`
      background-color: white;
      color: black;
    `}
`;

export const TabContent = styled.div`
  border: 1px solid #777;
  border-radius: 3px;
  padding: 10px;
  position: relative;
  z-index: 10;
  background-color: white;
`;

// export const TabContent = ({ children }) => <>{children}</>;
