import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/count','Controllers.countAllUsers')
  Route.get('/all-users', 'Controllers.showAllUsers')
  Route.get('/find-by-email','Controllers.findUserByEmail')
  Route.get('/get-single-post/:id','Controllers.getSingleUserPosts')
  Route.get('/get-single-user/:id','Controllers.getSingleUser')
  Route.get('/all-posts','Controllers.getAllUsersPosts');
  Route.get('/get-single-profile/:id','Controllers.getSingleProfileByUserId')

  Route.post('/create-user', 'Controllers.createUser')
  Route.post('/update-user/:id','Controllers.updateUser')
  Route.post('/update-profile/:id','Controllers.updateProfile')
  Route.post('/posts/:id','Controllers.createPost')
  Route.post('/delete-user/:id','Controllers.deleteSingleUser')
  Route.post('/delete-post-by-id/:id','Controllers.deletePostById')

  //many-to-many
  Route.post('/assign-role/:id','Controllers.assignRoleByUserId')
  Route.post('/create-role','Controllers.createRole')
  Route.post('/remove-role/:id','Controllers.removeRoleByUserId')
  Route.post('/sync-role/:id','Controllers.syncRoleByUserId')
})
.prefix('/api/v1/users')
.namespace('App/Controllers/Http/DatabaseLessions')