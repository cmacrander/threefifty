import styled, { css } from 'styled-components';

const Button = styled.button`
  padding: 5px 10px;
  border-radius: 3px;
  background-color: white;
  cursor: pointer;

  &[disabled] {
    color: white;
    background-color: gray;
    cursor: not-allowed;
  }

  ${props =>
    props.danger &&
    css`
      color: white;
      background-color: red;
    `}
`;

export default Button;
