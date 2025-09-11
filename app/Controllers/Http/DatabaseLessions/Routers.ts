import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/all-users', 'Controllers.showAllUsers')
  Route.get('/find-by-email','Controllers.findUserByEmail')
  Route.get('/get-single-post/:id','Controllers.getSingleUserPosts')
  Route.get('get-single-user/:id','Controllers.getSingleUser')
  Route.get('/all-posts','Controllers.getAllUsersPosts');

  Route.post('/create-user', 'Controllers.createUser')
  Route.post('/update-user/:id','Controllers.updateUser')
  Route.post('/update-profile/:id','Controllers.updateProfile')
  Route.post('/posts/:id','Controllers.createPost')
  Route.post('/delete-user/:id','Controllers.deleteSingleUser')
  Route.post('/delete-post-by-id/:id','Controllers.deletePostById')
})
.prefix('/api/v1/users')
.namespace('App/Controllers/Http/DatabaseLessions')