import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  // Video upload from URL
  Route.post('/videos/upload-by-url', 'VideosController.uploadVideoByUrl')
  
  // Video CRUD operations
  Route.get('/videos', 'VideosController.showAllVideos')
  Route.get('/videos/:id', 'VideosController.showSingleVideo')
  Route.post('/update/:id', 'VideosController.updateVideo')
  Route.post('/delete/:id', 'VideosController.destroyVideo')
  Route.post('/webhook','VideosController.BunnyWebHookResponse')
})
.prefix('/api/v1')
.namespace('App/Controllers/Http/Videos')
