import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  // Video upload from URL
  Route.post('/videos/upload-from-url', 'VideosController.uploadFromUrl')
  
  // Video CRUD operations
  Route.get('/videos', 'VideosController.index')
  Route.get('/videos/:id', 'VideosController.show')
  Route.put('/videos/:id', 'VideosController.update')
  Route.delete('/videos/:id', 'VideosController.destroy')
}).prefix('/api/v1')