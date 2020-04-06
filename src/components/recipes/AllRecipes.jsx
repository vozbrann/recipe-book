import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {Link, useHistory} from 'react-router-dom';

import styled from 'styled-components';

import {AsyncTypeahead} from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';

import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Badge from 'react-bootstrap/Badge';
import FormControl from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';
import Button from 'react-bootstrap/Button';
import DeleteButton from '../DeleteButton';
import EditButton from '../EditButton';

const StyledCard = styled(Card)`
  height: 100%;
  img {
    transition: all 0.3s ease;
    filter: brightness(1);
  }
  :hover {
    .card-img-top, .card-body {
      cursor: pointer;
    }
    
  }
  :hover img{
    filter: brightness(0.7);
  }
`;
const StyledCardImg = styled(Card.Img)`
  object-fit: cover;
  height: 200px;
`;
const StyledCardText = styled(Card.Text)`
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
`;

const AllRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [categoriesOptions, setCategoriesOptions] = useState([]);
  const [categoriesSelected, setCategoriesSelected] = useState(
    !!localStorage.getItem('selectedCategories') ? JSON.parse(
      localStorage.getItem('selectedCategories')) : []);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [searchText, setSearchText] = useState(
    localStorage.getItem('searchText') || '');
  const [fetchErrorMessage, setFetchErrorMessage] = useState('');
  const [recipesLoading, setRecipesLoading] = useState(false);
  const [sortAsc, setSortAsc] = useState(!!localStorage.getItem('sortAsc'));

  const history = useHistory();

  const filterByCategories = (recipes) => {
    if (!categoriesSelected.length) {
      return recipes;
    }
    return recipes.filter(
      recipe => categoriesSelected.includes(recipe.category));
  };

  const searchByName = (recipes) => {
    if (!searchText) {
      return recipes;
    }
    return recipes.filter(
      recipe => recipe.title.toLowerCase().includes(searchText.toLowerCase()));
  };

  const sortByDate = (recipes) => {
    return recipes.sort((a, b) => {
      return sortAsc ? a.createDate - b.createDate : b.createDate -
        a.createDate;
    });
  };

  const filterAndSortRecipes = (recipes) => {
    return sortByDate(searchByName(filterByCategories(recipes)));
  };

  useEffect(() => {
    updateRecipes();
  }, []);

  const updateRecipes = () => {
    setRecipesLoading(true);
    axios.get(` http://localhost:3000/recipes`)
      .then(res => {
        setFetchErrorMessage('');
        const recipes = res.data;
        setRecipes(recipes);
        setRecipesLoading(false);
      })
      .catch(error => {
        setFetchErrorMessage('Failed to fetch recipes.');
        console.log(error);
        setRecipesLoading(false);
      });
  };

  const handleCategoriesSearch = () => {
    setCategoriesLoading(true);
    axios.get(` http://localhost:3000/recipes`)
      .then(res => {
        const categories = [
          ...new Set(res.data.map(recipe => recipe.category))];
        setCategoriesOptions(categories);
        setCategoriesLoading(false);
      })
      .catch(error => {
        console.log(error);
        setCategoriesLoading(false);
      });
  };

  const handleDelete = (id) => {
    axios.delete(` http://localhost:3000/recipes/${id}`)
      .then(res => {
        updateRecipes();
      })
      .catch(error => {
        console.log(error);
      });
  };

  const onSelectedCategoriesChange = (selected) => {
    setCategoriesSelected(selected);
    localStorage.setItem('selectedCategories', JSON.stringify(selected));
  };

  const onSearchInputChange = (e) => {
    setSearchText(e.target.value);
    localStorage.setItem('searchText', e.target.value);
  };

  const onSortOrderChange = () => {
    const newSortAsc = !sortAsc;
    setSortAsc(newSortAsc);
    localStorage.setItem('sortAsc', newSortAsc ? 'true' : '');
  };

  return (
    <Container className="pt-5">
      <Row>
        <Col md={6} className="mb-3">
          <InputGroup>
            <InputGroup.Prepend>
              <InputGroup.Text>Search by name:</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl value={searchText} onChange={onSearchInputChange}/>
          </InputGroup>
        </Col>
        <Col md={6} className="mb-3">
          <InputGroup>
            <InputGroup.Prepend>
              <InputGroup.Text>Filter by categories:</InputGroup.Text>
            </InputGroup.Prepend>
            <AsyncTypeahead
              isLoading={categoriesLoading}
              minLength={1}
              clearButton
              onChange={selected => onSelectedCategoriesChange(selected)}
              selected={categoriesSelected}
              id="categories-filter"
              labelKey="categories"
              onSearch={handleCategoriesSearch}
              multiple
              options={categoriesOptions}
            />
          </InputGroup>
        </Col>
      </Row>
      <div className="d-flex justify-content-between">
        <Button onClick={onSortOrderChange} className="mb-3"
                variant="secondary">
          Sort by date
          {sortAsc ?
            <span className="material-icons align-bottom">arrow_drop_up</span>
            :
            <span className="material-icons align-bottom">arrow_drop_down</span>
          }
        </Button>
        <Button as={Link} to='/add' className="mb-3" variant="success">
          Add new <span className="material-icons align-bottom pb-0">add</span>
        </Button>
      </div>
      <Row>
        {recipesLoading ?
          <Spinner className="mx-auto mt-5" animation="border"/>
          :
          (
            !!fetchErrorMessage.length ?
              <Col className="mx-auto">
                <Alert variant="danger">
                  {fetchErrorMessage}
                </Alert>
              </Col>
              :
              filterAndSortRecipes(recipes).map(recipe => (
                <Col key={recipe.id} md={6} lg={4} className="mb-4">
                  <StyledCard>
                    <StyledCardImg
                      onClick={() => history.push('/recipes/' + recipe.id)}
                      variant="top" src="https://source.unsplash.com/random"/>
                    <Card.Body
                      onClick={() => history.push('/recipes/' + recipe.id)}>
                      <Card.Title>
                        <span className="mr-2">
                        {recipe.title}
                        </span>
                        <Badge className="d-inline-block text-truncate" style={{maxWidth: "95%"}} pill variant="secondary">{recipe.category}</Badge>
                      </Card.Title>
                      <StyledCardText>{recipe.shortDesc}</StyledCardText>
                    </Card.Body>
                    <Card.Footer className="d-flex justify-content-between">
                      <span>
                        <small>
                          <time
                            dateTime={new Date(
                              parseInt(recipe.createDate)).toLocaleDateString()}
                            className="text-muted">
                          {new Date(parseInt(recipe.createDate)).toLocaleDateString()}
                          </time>
                        </small>
                      </span>
                      <div>
                        <EditButton as={Link} to={"edit/"+recipe.id}/>
                        <DeleteButton onClick={() => handleDelete(recipe.id)}/>
                      </div>
                    </Card.Footer>
                  </StyledCard>
                </Col>
              )
            )
          )
        }
      </Row>
    </Container>
  );
};

export default AllRecipes;
