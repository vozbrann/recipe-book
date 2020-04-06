import React from 'react';
import styled from 'styled-components';

const StyledEditButton = styled.span`
  color: #000;
  text-decoration: none;
  margin-left: 0.5em;
  transition: all 0.3s ease;
  :hover {
    color: #fda400;
    cursor: pointer;
  }
`;

const EditButton = (props) => {
  return (
    <StyledEditButton {...props} className="material-icons">create</StyledEditButton>
  );
};

export default EditButton;
