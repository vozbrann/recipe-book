import React from 'react';

import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';

import {Link} from 'react-router-dom';

const AppBar = () => {
  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/recipes" className="font-weight-bold">Recipe-book</Navbar.Brand>
      </Container>
    </Navbar>
  );
};

export default AppBar;
