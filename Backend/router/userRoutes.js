import express from 'express';
import {createUser, loginUser,getAllUsers,deleteUser,getProfile} from '../controller/controller_User.js';
import {verifytoken , isadmin} from '../middleware/auth.js'
const user_router = express.Router();
import { showTasks } from '../controller/controller_Tasks.js';

user_router.post('/register',createUser);
user_router.post('/login',loginUser);
user_router.get('/profile', verifytoken, getProfile);

user_router.get('/allusers',verifytoken,isadmin,getAllUsers);
user_router.delete('/:id',verifytoken,isadmin,deleteUser);
user_router.get(
  "/:id/tasks",
  verifytoken,
  isadmin,
  showTasks
);

export default user_router;