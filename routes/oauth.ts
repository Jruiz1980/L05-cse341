import express, {Router} from 'express';

const loginRouter : Router = express.Router();

loginRouter.get("/google", (req, res) => res.send("Connected"));

export {loginRouter}