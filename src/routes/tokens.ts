import express from 'express';
import controller from '../controller/tokens';

const tokenRouter = express.Router();

tokenRouter.get('/api/tokens', controller.getTokens);

export default tokenRouter;
