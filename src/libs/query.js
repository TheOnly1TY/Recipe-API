// const AllRecipes = `SELECT jsonb_build_object(
// 		'id', r.id,
// 		'name', r.name,
// 		'meal', r.meal,
// 		'minutes', r.minutes,
// 		'servings', r.servings,
// 		'ingredients', COALESCE(
// 				jsonb_agg(jsonb_build_object(
// 					'name', i.name,
// 					'quantity', i.quantity,
// 					'unit', i.unit
// 					) ORDER BY i.id) FILTER(WHERE i.id IS NOT NULL),
// 			'[]'::jsonb
// 		),
//     'steps', r.step
// ) AS recipes FROM recipes r LEFT JOIN ingredients i ON r.id = i.recipeid GROUP BY r.id;`

const AllRecipes  = `SELECT * FROM recipes;`

const Recipe = `SELECT jsonb_build_object(
		'id', r.id,
		'name', r.name,
		'meal', r.meal,
		'minutes', r.minutes,
		'servings', r.servings,
		'ingredients', COALESCE(
				jsonb_agg(jsonb_build_object(
					'name', i.name,
					'quantity', i.quantity,
					'unit', i.unit
					) ORDER BY i.id) FILTER(WHERE i.id IS NOT NULL),
			'[]'::jsonb
		),
    'steps', r.step
) AS recipe FROM recipes r LEFT JOIN ingredients i ON r.id = i.recipeid WHERE r.id = $1 GROUP BY r.id;`


export {AllRecipes, Recipe};