import express from 'express'

import {getAllRecipes, getRecipe, createRecipes, updateRecipes, deleteRecipes} from '../controllers/recipes.controller.js'
import {protect, restrictTo} from "../controllers/auth.controller.js"
const router  = express.Router();

router.route('/').get(getAllRecipes).post(protect, createRecipes)
router.route('/:id').get(getRecipe).patch(protect, updateRecipes).delete(protect, deleteRecipes)

export default router