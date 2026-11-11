import express from 'express'
import morgan from 'morgan';
import AppError from './libs/appError.js';
import recipesRouter from './routes/recipes.route.js';
import usersRouter from './routes/users.route.js';
import { globalErrorHandler } from './controllers/global-error-handler.controller.js';

const app = express();

app.use(express.json());
app.use(morgan('dev'));


app.use('/api/v1/recipes', recipesRouter)
app.use('/api/v1/users', usersRouter)


app.get('/', (req, res) => {
    res.json({message: 'Hello from the recipe backend!'})
})
app.all('/{*path}', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

export default app


// BUSINESS NEEDS OF RECIPE

// A recipe application where people can come in to check for recipes (not authenticated) but people can create account and create recipes, edit and delete recipes.
