import React, { useContext } from 'react';
import axios from 'axios';
import UserContext from '../context/UserContext';
import { useHistory } from 'react-router-dom';

import '../styles/DetailedRecipeView.css';

//shows detailed recipe info within ViewRecipe.js

const DetailedRecipeView = ({ recipe }) => {
  const history = useHistory();
  const { userData, setUserData } = useContext(UserContext);

  // send a put request to delete a recipe, takes in the current user, and recipe id as data
  const deleteRecipe = async () => {
    try {
      const newRecipes = await axios.put(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/users/recipes/delete`,
        { id: userData.user, recipeId: recipe.id },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': userData.token,
          },
        }
      );
      console.log('recipe has been deleted');
      //  sets the userData as token, current user and the newly returned recipes from the above put request
      await setUserData({
        token: userData.token,
        user: userData.user,
        recipes: newRecipes.data,
      });
      // send us back to home/root directory
      history.push(`/`);
    } catch (err) {
      // if any errors catch and log them
      console.log(err);
    }
  };

  return (
    <div className='container'>
      <div className='header-container'>
        <h2 className='recipeViewHeader'>{recipe.name}</h2>{' '}
        <button
          className='recipe-delete'
          data-cy='deleteButton'
          onClick={deleteRecipe}
        >
          Delete
        </button>
      </div>

      <img src={recipe.image} alt='' />

      <div className='cookingTimes'>
        {recipe.preptime > 0 && <span>Prep Time: {recipe.preptime}</span>}
        {recipe.cookingMinutes > 0 && (
          <span>Cooking Time: {recipe.cookingMinutes}</span>
        )}
        {recipe.totalCookingTime > 0 && (
          <span>Total Cooking Time: {recipe.totalCookingTime}</span>
        )}
      </div>

      {recipe.winePairing.length > 0 && <p>{recipe.winePairings}</p>}

      <p>
        <b>Source:</b>{' '}
        <a href={recipe.recipeUrl} target='_blank' rel='noopener noreferrer'>
          {recipe.sourceName || 'here'}
        </a>
      </p>

      {recipe.diets.length > 0 && (
        <p>
          <b>Diet categories:</b>{' '}
          {recipe.diets.map((diet, index) => (
            <span key={`diet${index}`}>{diet}, </span>
          ))}
        </p>
      )}
      {recipe.cuisines.length > 0 && <p>Cuisines: {recipe.cuisines}</p>}

      <p className='ingredients'>
        <b>Ingredients:</b>
        {recipe.ingredients.map((ingredient, index) => (
          <li key={`ingredient${index}`}>{ingredient.original}</li>
        ))}
      </p>

      {recipe.instructions.length > 0 && (
        <ol className='instructions'>
          <b>Instructions:</b>
          {recipe.instructions[0].steps.map((steps, index) => (
            <li key={`step${index}`}>{steps.step}</li>
          ))}
        </ol>
      )}
    </div>
  );
};

export default DetailedRecipeView;
