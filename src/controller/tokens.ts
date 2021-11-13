import {Request, Response} from 'express';

import * as fs from 'fs';
import {Account} from "../dto/account";

const filePath = "./accounts.json";

const getTokens: any = async (req: Request, res: Response) => {
    const content = fs.readFileSync(filePath, "utf8");
    const accounts: [Account] = JSON.parse(content);
    res.send(accounts.map(account => account.token));
};

export default {getTokens};

