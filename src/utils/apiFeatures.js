import { ALLOWED } from "./helpers.js";

const filterFields = (queryParams) => {
  const excludedFields = ['page', 'sort', 'limit', 'fields'];

  const filters = Object.entries(queryParams)
    .filter(([field]) => !excludedFields.includes(field));

  const conditions = [];
  const values = [];

  for (const [field, value] of filters) {

    if (!ALLOWED.includes(field)) {
      throw new AppError(`Invalid filter field: ${field}`, 400);
    }

    if (typeof value !== 'string' || !value.trim()) {
      throw new AppError(`Invalid filter value: ${field}`, 400);
    }

    values.push(value.trim());

    conditions.push(`${field} = $${values.length}`);
  }

  const whereClause = conditions.length
    ? `WHERE ${conditions.join(' AND ')}`
    : '';
;
  return { whereClause, values };
};

const sortFields = (sort) => {
  if(!sort) return 'id ASC'
  const requestedSort = sort.split(',').map(field => field.trim()) 

  const parsedSort = requestedSort.map(field => {
    const isDesending = field.startsWith('-')
    const fieldName = isDesending ? field.slice(1) : field

    if(!ALLOWED.includes(fieldName)) throw new AppError('Invalid Sort Fields', 400)
      
    return isDesending ? `${fieldName} DESC` : `${fieldName} ASC`
  })

  return parsedSort.join(', ')
}

const limitFields = (fields) => {
  if(fields === '*') return '*'
 
  const requestedFields = fields.split(',').map(field => field.trim())

  const excludedFields = requestedFields.every(field => ALLOWED.includes(field))
  if(!excludedFields) throw new AppError(`Invalid Fields`, 400)

  return requestedFields.join(', ')
}

export { filterFields, sortFields, limitFields}