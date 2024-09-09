const express = require('express');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();
app.use(express.json());

// console.log(app.get('env'));
// to use static file
app.use(express.static(`${__dirname}/public`));

// app.get('/', (req, res) => res.status(200).send('Hello World!'))
// app.get('/api/v1/tours', getAllTours);
// app.get('/api/v1/tours/:id', getTour);

// app.post('/api/v1/tours', createTour);

// app.patch('/api/v1/tours/:id', updateTour);

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// handling unhandled routes
app.all('*', (req, res, next) => {
  //   const err = new Error(`can't find ${req.originalUrl} on this server`);
  //   err.status = 'fail';
  //   err.statusCode = 404;
  next(new AppError(`can't find ${req.originalUrl} on this server`, 404));
});

// global error handling middleware
app.use(globalErrorHandler);

module.exports = app;
