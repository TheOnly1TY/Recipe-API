import { catchAsync } from "../utils/catchAsync.js";
import db from '../config/db.js'

const getAllUsers = catchAsync(async(req,res,next) => {
    const allUsers = await db.query('SELECT * FROM users;')

    res.status(200).json({
        status: 'success',
        message: 'Users fetched successfully',
        rowCount: allUsers.rowCount,
        users: allUsers.rows
    })
}) 

export{getAllUsers}