import express from 'express';
import { 
    createTask, 
    updateTask, 
    deleteTask, 
    searchfilters,
} from '../controller/controller_Tasks.js';

import { verifytoken,isadmin } from '../middleware/auth.js';

const task_router = express.Router();
task_router.post('/', verifytoken, createTask);
task_router.put('/:id', verifytoken, updateTask);
task_router.delete('/:id', verifytoken, deleteTask);
task_router.get('/', verifytoken, searchfilters);

export default task_router;
