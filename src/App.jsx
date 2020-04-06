import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom'
import AppBar from './components/AppBar';
import Recipes from './components/recipes/Recipes';
import Add from './components/recipes/Add';
import Edit from './components/recipes/Edit';

function App() {
  return (
    <div className="App">
      <AppBar/>
      <Switch>
        <Route exact path='/'>
          <Redirect to="/recipes"/>
        </Route>
        <Route path='/recipes' component={Recipes}/>
        <Route path='/add' component={Add}/>
        <Route path='/edit/:id' component={Edit}/>
      </Switch>
    </div>
  );
}

export default App;
