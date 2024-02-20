import  express  from "express";
import {loginController, registerController} from '../controllers/authController.js'
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
const authRouter = express.Router()


// Routing 
// REGISTER || Method post
authRouter.post('/register', registerController)

// Login || Method post
authRouter.post('/login', loginController)

authRouter.get('/test', requireSignIn, isAdmin, (req, res) => {
    return res.send({
        message: "Token protected Route"
    })
})

export default authRouter;