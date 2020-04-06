import React from 'react';
import styled from 'styled-components';

const StyledDeleteButton = styled.span`
  margin-left: 0.5em;
  transition: all 0.3s ease;
  :hover {
    color: #e20000;
    cursor: pointer;
  }
`;

const DeleteButton = (props) => {
  return (
    <StyledDeleteButton {...props} className="material-icons">delete</StyledDeleteButton>
  );
};

export default DeleteButton;
