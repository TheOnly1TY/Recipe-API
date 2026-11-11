import { catchAsync } from '../utils/catchAsync.js';
import AppError from "../libs/appError.js";
import { createRecipe, FindRecipe, UpdateRecipe, FindAndDeleteRecipe } from '../models/recipe-service-model.js';
import { ALLOWED } from '../utils/helpers.js';
import db from '../config/db.js';
import { filterFields, limitFields, sortFields } from '../utils/apiFeatures.js';

const getAllRecipes = catchAsync((async (req, res, next) => {
  const { fields = '*', sort, page = 1, limit = 2} = req.query

  let limitQueryValue
  let offsetQueryValue
  
  const filteredFieldsResult = filterFields(req.query)
  const sortFieldsResult = sortFields(sort)
  const limitFieldsResult = limitFields(fields)

  limitQueryValue = filteredFieldsResult.values.length + 1
  offsetQueryValue = filteredFieldsResult.values.length + 2

  const result = await db.query(`SELECT ${limitFieldsResult} FROM recipes ${filteredFieldsResult.whereClause} ORDER BY ${sortFieldsResult} LIMIT $${limitQueryValue} OFFSET $${offsetQueryValue}`, [...filteredFieldsResult.values, limit, (page - 1) * limit]);

  res.status(200).json({
    status: 'success',
    message: 'Recipes loaded successfully',
    data: {
      count: result.rowCount,
      recipes: result.rows
    },
    page: parseInt(page)
  })

}));

const getRecipe = catchAsync((async (req, res, next) => {
  const result = await FindRecipe(req.params.id)
    
  if(!result) return next(new AppError('Recipe not found', 404));

  res.status(200).json({
    status: 'success',
    message: 'Recipe loaded successfully',
    data: result,
  })

}));

const createRecipes = catchAsync(async (req, res, next) => {
  const recipe = req.body
  const Fields = ['userId']
  const ParameterizedQuery = ['$1']
  const Values = [req.user.id]

  for(const col of ALLOWED) {
    if(recipe[col] !== undefined) {
      Fields.push(col)
      ParameterizedQuery.push(`$${Fields.length}`)
      Values.push(recipe[col])
    }
  }

  if(Fields.length === 0) return next(new AppError(`No Valid Fields`, 400))

  const result = await createRecipe(Fields, ParameterizedQuery, Values)

  res.status(201).json({
    status: 'success',
    message: 'Recipe created successfully',
    data: result
  })

});

const updateRecipes = catchAsync(async (req, res, next) => {
  const Fields = []
  const Values = []

  for(const col of ALLOWED) {
    if(req.body[col] !== undefined) {
      Fields.push(`${col} = $${Fields.length + 1}`)
      Values.push(req.body[col])
    }
  }

  if(Fields.length === 0) return next(new AppError(`No Valid Fields`, 400))

  const result = await UpdateRecipe(Fields, Values, req.params.id, req.user.id) 

  if(!result) return next(new AppError('Recipe not found', 404))

  res.status(200).json({
    status: 'success',
    message: 'Recipe updated successfully',
    data: result
  })
});

const deleteRecipes = catchAsync(async (req, res, next) => {
  const deletedRecipe = await FindAndDeleteRecipe(req.params.id, req.user.id)

  if (!deletedRecipe) return next(new AppError('Recipe not found', 404));
  
  res.status(200).json({
    status: "success",
    message: "Recipe Deleted Successsfully"
  })
});


export {getAllRecipes, getRecipe, createRecipes, updateRecipes, deleteRecipes}
