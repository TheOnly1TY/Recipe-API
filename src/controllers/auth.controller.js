import { catchAsync } from "../utils/catchAsync.js";
import {promisify} from 'util'
import db from "../config/db.js"
import AppError from "../libs/appError.js";
import dotenv from 'dotenv'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

dotenv.config({ path: "./config.env" })

const signToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES_IN})
}

const confirmPassword = async (candidatePassword, userPassword) => {
    return await bcrypt.compare(candidatePassword, userPassword)
}


const signup = catchAsync(async(req, res, next) => {

    if(!req.body?.fullname || !req.body?.email || !req.body?.password) return next(new AppError('Please provide a name, email or password', 400))

    const newPassword = await bcrypt.hash(req.body?.password, 10)

    const result = await db.query(`INSERT INTO users (fullname, email, password) VALUES ($1, $2, $3) RETURNING id, fullname, email;`, [req.body?.fullname, req.body?.email, newPassword]);

    const newUser = result.rows[0].id

    const token = jwt.sign({id: newUser}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES_IN})

    const user = result.rows[0]
    
    res.status(201).json({
        status: 'success',
        token,
        user
    })

} )

const login = catchAsync(async(req, res, next) => {
    const {email, password} = req.body

    // 1. check if email and password exists
    if(!email || !password) return next(new AppError('Please provide email and password', 400))

    // 2. check if the user exists && password is correct
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email])
    
    const user = result.rows[0];

    if (!user || !(await confirmPassword(password, user.password))) {
        return next(new AppError('Incorrect email or password', 401));
    }

    // 3. if everything ok., send token to client
    const  token = signToken(user.id)
    res.status(200).json({
        message: 'success',
        token
    })
})


const protect = catchAsync(async(req, res, next) => {

    let token;

    // 1. Getting token and check if it's there
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1]
    }
    if(!token){
        return next(new AppError('You are not logged in! Please log in to get access.', 401))
    }

    // 2. Verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)

    // 3. Check if user still exists
    const currentUser = await db.query(`SELECT * FROM users WHERE id = $1`, [decoded.id])


    if(!currentUser.rows[0]) return next(new AppError('The user belonging to this token does no longer exist.', 401))
    
    
    // 4. Check if user changed password after the token was issued
    // Research how to integrate this function using postgres to check if the user changed the pasword after the token was issued

    req.user = currentUser.rows[0]
    next()
})

const restrictTo = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)){
            return next(new AppError('You do not have permission to perform for this action', 403))
        }
    next()
    }
}

export {signup, login, protect, restrictTo}