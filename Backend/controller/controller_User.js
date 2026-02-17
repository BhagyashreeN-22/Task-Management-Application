import db from '../config/schema.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
//User registration
export const createUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const [existingUser] = await db.query(
            "SELECT * FROM users WHERE email = ?",
            [email]
        );

        if (existingUser.length > 0) {
            return res.status(400).json({
                message: "Email already registered"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const sql = `
            INSERT INTO users (name, email, password, role)
            VALUES (?, ?, ?, ?)
        `;

        await db.query(sql, [
            name,
            email,
            hashedPassword,
            role || 'user'
        ]);

        res.status(201).json({
            message: "Registration successful"
        });

    } catch (error) {
        return res.status(500).json({
            message: "Unable to register. Please try again.",
            error: error.message
        });
    }
};

//User login

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const sql = `SELECT * FROM users WHERE email = ?`;
        const [users] = await db.query(sql, [email]);

        if (users.length === 0) {
            return res.status(400).json({
                message: "User not found!"
            });
        }

        const user = users[0];

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                message: "Password doesn't match"
            });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.status(200).json({
            message: "Login Successful! Welcome",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        res.status(500).json({
            message: "Login failed",
            error: error.message
        });
    }
};

//user profile
export const getProfile = async (req, res) => {
    try {
        const user_id = req.user.id;

        // 1️⃣ Get user details (without password)
        const [users] = await db.query(
            "SELECT id, name, email, role, created_at FROM users WHERE id = ?",
            [user_id]
        );

        if (users.length === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // 2️⃣ Get user's tasks
        const [tasks] = await db.query(
            "SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC",
            [user_id]
        );

        res.status(200).json({
            user: users[0],
            tasks: tasks
        });

    } catch (error) {
        res.status(500).json({
            message: "Error fetching profile",
            error: error.message
        });
    }
};

//user if admin can see all users 

export const getAllUsers = async (req,res)=>{
    try{
    const sql =` SELECT * FROM users WHERE role!="admin"`
    const [users] = await db.query(sql);
    res.status(200).json(users);
    }catch(error){
        res.status(500).json({message:'Users not found'});
    }
};

//user if admin  can delete them

export const deleteUser =async(req,res)=>{
    try{
        const {id} =req.params;
        const sql=`DELETE FROM users WHERE id =?`;
        await db.query(sql,[id]);
        res.status(200).json({message:'User deleted successfully'});
     }
     catch(error){
        res.status(500).json({message:'User not found',error});
     }
}