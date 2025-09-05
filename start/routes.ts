/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
  return { hello: 'world' }
})
// API Routes
Route.group(() => {
  // Video upload from URL
  Route.post('/videos/upload-from-url', 'VideosController.uploadFromUrl')
  
  // Video CRUD operations
  Route.get('/videos', 'VideosController.index')
  Route.get('/videos/:id', 'VideosController.show')
  Route.put('/videos/:id', 'VideosController.update')
  Route.delete('/videos/:id', 'VideosController.destroy')
}).prefix('/api/v1')
