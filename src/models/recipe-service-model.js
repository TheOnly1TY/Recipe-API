import db from "../config/db.js"

const FindallRecipes = async () => {
    const result = await db.query(`SELECT * FROM recipes;`)

    return result
}

const FindRecipe = async (id) => {
    const result = await db.query(`SELECT * FROM recipes WHERE id = $1`, [id]);

    return result.rows[0]
}

const createRecipe = async (Fields, ParameterizedQuery, Values) => {
    const result = await db.query(`INSERT INTO recipes (${Fields.join(', ')}) VALUES (${ParameterizedQuery.join(', ')}) RETURNING *;`, Values)
        
    return result.rows[0]
}

const UpdateRecipe = async(Fields, Values, recipeId, userId) => {
    const result = await db.query(
        `UPDATE recipes SET ${Fields.join(', ')} WHERE id = $${Values.length + 1} AND userId = $${Values.length + 2} RETURNING *`,
        [...Values, recipeId, userId])

    return result.rows[0]
}


const FindAndDeleteRecipe = async (id, userId) => {
  const result = await db.query(
    'DELETE FROM recipes WHERE id = $1 AND userId = $2 RETURNING *;',
    [id, userId]
  );
  return result.rows[0];
};


export {FindallRecipes, FindRecipe, createRecipe, UpdateRecipe, FindAndDeleteRecipe}