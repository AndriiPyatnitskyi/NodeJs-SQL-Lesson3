import express from 'express';
import controller from '../controller/tokens';
import {Role} from "../model/account";

const permit = require("../middleware/auth");

const tokenRouter = express.Router();

tokenRouter.get('/api/tokens', permit([Role.ANONYMOUS, Role.USER, Role.ADMIN]), controller.getTokens);

export default tokenRouter;
