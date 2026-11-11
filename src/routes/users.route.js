import express from 'express';
import { signup, login } from '../controllers/auth.controller.js';
import {getAllUsers} from '../controllers/users.controller.js'

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);


router.route('/').get(getAllUsers)

export default router;