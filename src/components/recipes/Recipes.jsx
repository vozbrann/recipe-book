import React from 'react';
import { Switch, Route } from 'react-router-dom'

import AllRecipes from './AllRecipes';
import OneRecipe from './OneRecipe';

const Recipes = () => {
  return (
    <Switch>
      <Route exact path='/recipes' component={AllRecipes}/>
      <Route path='/recipes/:id' component={OneRecipe}/>
    </Switch>
  );
};

export default Recipes;
