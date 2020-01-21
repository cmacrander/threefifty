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
      <div>
        {React.Children.map(children, (child, tabIndex) =>
          activeTabIndex === tabIndex ? child : null,
        )}
      </div>
    </>
  );
};

export const TabTitle = styled.span`
  display: inline-block;
  padding: 3px 5px;
  border: 1px solid white;

  ${props =>
    props.active &&
    css`
      background-color: white;
      color: blue;
    `}
`;

export const TabContent = ({ children }) => <>{children}</>;

