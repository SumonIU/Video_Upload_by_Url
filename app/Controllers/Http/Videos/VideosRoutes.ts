import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  // Video upload from URL
  Route.post('/videos/upload-from-url', 'VideosController.uploadFromUrl')
  
  // Video CRUD operations
  Route.get('/videos', 'VideosController.index')
  Route.get('/videos/:id', 'VideosController.show')
  Route.post('/update/:id', 'VideosController.update')
  Route.post('/delete/:id', 'VideosController.destroy')
  Route.post('/webhook','WebhookController.webhook')
})
.prefix('/api/v1')
.namespace('App/Controllers/Http/Videos')
