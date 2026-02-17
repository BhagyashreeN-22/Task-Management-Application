import db from '../config/schema.js';

//create task
export const createTask = async (req, res) => {
  try {
    const { title, description, status, due_date } = req.body;
    const user_id = req.user.id;

    const sql = `
      INSERT INTO tasks 
      (title, description, status, user_id, due_date) 
      VALUES (?, ?, ?, ?, ?)
    `;

    const [result] = await db.query(sql, [
      title,
      description || null,
      status || "pending",
      user_id,
      due_date || null,
    ]);

    // ✅ Get inserted task using insertId
    const [newTask] = await db.query(
      "SELECT * FROM tasks WHERE id = ?",
      [result.insertId]
    );

    res.status(201).json({
      message: "Task created successfully",
      task: newTask[0],   // ✅ return single object
    });

  } catch (error) {
    res.status(500).json({
      message: "Unable to create task",
      error: error.message,
    });
  }
};



// update task
export const updateTask = async(req,res)=>{
    try{
    const {id} =req.params;  //params means id cmg from url
    const {status} = req.body; //  cmg from client req body
    const user_id = req.user.id;
    
    const [tasks]=await db.query(
        "SELECT  id FROM tasks WHERE id=? AND user_id=?",
        [id,user_id]
    );
    if(tasks.length == 0){
        return res.status(403).json({message:'Task not found'});
    }

    await db.query(
        "UPDATE tasks SET status =? where user_id =? AND id=?",
        [status,user_id,id]
    );
    res.status(200).json({
        message:'Task updated successfully'
    })
    }catch(error){
        res.status(500).json({
            message:'Unable to updated!',
            error:error.message
        });
    }
}

//delete task
export const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const [result] = await db.query(
            "DELETE FROM tasks WHERE id = ? AND user_id = ?",
            [id, userId]
        );

        if (result.affectedRows === 0) {
            return res.status(403).json({
                message: "Task not found or not authorized"
            });
        }

        res.status(200).json({
            message: "Task deleted successfully!"
        });

    } catch (error) {
        res.status(500).json({
            message: "Error deleting task",
            error: error.message
        });
    }
};

//search filter based on status, title, due date

export const searchfilters = async (req,res)=>{
    try{
        const user_id = req.user.id;
        const {status,search,due_date} = req.query;

        let sql =`SELECT * FROM tasks WHERE user_id =?`;
        let values = [user_id];

        if(status){
          sql+=` AND status=?`;
          values.push(status);
        }
        if(search){
            sql+=` AND title LIKE ?`;
            values.push(`%${search}%`);
        }
        if(due_date){
            sql+=` AND DATE(due_date)=?`;
            values.push(due_date);
        }
        const [tasks] = await db.query(sql,values);
        res.status(200).json(tasks);

    }catch(error){
        res.status(500).json({
            message:'Not found!'
        });
    };
};

//To show all tasks


export const showTasks = async(req,res)=>{
    try{
    const user = req.params.id
    const [result] = await db.query("SELECT * FROM tasks WHERE user_id=?",[user]);
    res.status(200).json({
        tasks  : result
    });
    }catch(error){
        res.status(500).json({message:'No tasks found!'});

    };
};