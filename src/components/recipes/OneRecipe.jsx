import React, {useEffect, useState} from 'react';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import EditButton from '../EditButton';
import DeleteButton from '../DeleteButton';
import {Link, useHistory, useParams} from 'react-router-dom';
import axios from 'axios';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';

const OneRecipe = () => {
  const [recipe, setRecipe] = useState({});
  const [recipeIsLoading, setRecipeIsLoading] = useState(false);
  const [recipeLoadingErrorMessage, setRecipeLoadingErrorMessage] = useState('');

  let { id } = useParams();

  useEffect(() => {
    setRecipeIsLoading(true);
    axios.get(` http://localhost:3000/recipes/${id}`)
      .then(res => {
        const recipe = res.data;
        setRecipeLoadingErrorMessage("");
        setRecipe(recipe);
        setRecipeIsLoading(false);
      })
      .catch(error => {
        if(error.response) {
          setRecipeLoadingErrorMessage(error.response.statusText)
        } else {
          setRecipeLoadingErrorMessage("Oops, something went wrong");
        }
        setRecipeIsLoading(false);
      });
  }, [id]);

  const history = useHistory();
  const handleDelete = (id) => {
    axios.delete(` http://localhost:3000/recipes/${id}`)
      .then(res => {
        history.goBack();
      })
      .catch(error => {
        console.log(error);
      });
  };

  return (
    <Container className="pt-5">
      <Row>
        {recipeIsLoading ?
          <Spinner className="mx-auto mt-5" animation="border"/>
          :
          (
            !!recipeLoadingErrorMessage.length &&
              <Col>
                <Alert variant="danger">
                  {recipeLoadingErrorMessage}
                </Alert>
              </Col>
          )
        }
      </Row>

      {!recipeLoadingErrorMessage.length && !recipeIsLoading &&
        <Row>
          <Col md={8}>
            <Row>
              <Col>
                <h1 className="text-break">{recipe.title}</h1>
              </Col>
              <Col className="col-auto">
                <EditButton as={Link} to={"/edit/"+recipe.id}/>
                <DeleteButton onClick={() => handleDelete(recipe.id)}/>
              </Col>
            </Row>
            <p className="font-italic text-break">"{recipe.shortDesc}"</p>
            <h4>Directions</h4>
            <p className="text-break">{recipe.longDesc}</p>
          </Col>
          <Col md={4}>
            <Image src="https://source.unsplash.com/random" rounded fluid/>
          </Col>
        </Row>
        }
    </Container>
  );
};

export default OneRecipe;
