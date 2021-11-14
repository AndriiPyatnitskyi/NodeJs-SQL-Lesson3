import express from 'express';
import controller from '../controller/accounts';
import {Role} from "../dto/account";

const permit = require("../middleware/auth");
const accountRouter = express.Router();

accountRouter.get('/api/accounts', permit([Role.ANONYMOUS, Role.USER, Role.ADMIN]), controller.getAccounts);
accountRouter.get('/api/accounts/:id', permit([Role.ANONYMOUS, Role.USER, Role.ADMIN]), controller.getAccountById);
accountRouter.post('/api/accounts', permit([Role.ANONYMOUS, Role.USER, Role.ADMIN]), controller.createAccount);
accountRouter.put('/api/accounts/:id', permit([Role.ANONYMOUS, Role.USER, Role.ADMIN]), controller.updateAccount);
accountRouter.delete('/api/accounts/:id', permit([Role.ADMIN]), controller.deleteAccount);
accountRouter.get('/api/accounts/:id/tokens', permit([Role.ANONYMOUS, Role.USER, Role.ADMIN]), controller.getAccountTokensByAccountId);
accountRouter.post('/api/accounts/:id/tokens', permit([Role.ANONYMOUS, Role.USER, Role.ADMIN]), controller.createAccountToken);
accountRouter.put('/api/accounts/:id/tokens', permit([Role.ANONYMOUS, Role.USER, Role.ADMIN]), controller.updateAccountToken);
accountRouter.delete('/api/accounts/:id/tokens', permit([Role.ADMIN]), controller.deleteAccountToken);


export default accountRouter;
