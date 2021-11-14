import {Request, Response} from 'express';
import * as fs from 'fs';
import {Role, Account} from "../dto/account";

const jwt = require("jsonwebtoken");
const secretKey = "mySecretKey";
const models = require("../server");
const filePath = "./accounts.json";

const getAccounts: any = async (req: Request, res: Response) => {
    const result = await models.default.AccountModel.findAll();
    res.send(result);
};

const getAccountById: any = async (req: Request, res: Response) => {
    const id = req.params.id;

    const result = await models.default.AccountModel.findByPk(id);

    if (result) {
        res.send(result);
    } else {
        res.status(404).send();
    }
};

const createAccount: any = async (req: Request, res: Response) => {
    if (!req.body) return res.sendStatus(400);

    const accountName: String = req.body.name;
    const accountRole: Role = req.body.role;

    const role = accountRole ? accountRole : Role.USER;

    const token = jwt.sign(
        {account_name: accountName, role: accountRole},
        secretKey,
        {
            expiresIn: "2h",
        }
    );

    const result = await models.default.AccountModel.create({name: accountName, token: token, role: role});

    res.send(result);
};

const updateAccount: any = async (req: Request, res: Response) => {
    if (!req.body) return res.sendStatus(400);

    const accountId = req.params.id;
    const accountName: String = req.body.name;

    let data = fs.readFileSync(filePath, "utf8");

    const accounts = JSON.parse(data);
    let account;
    for (let i = 0; i < accounts.length; i++) {
        if (accounts[i].id == accountId) {
            account = accounts[i];
            break;
        }
    }

    if (account) {
        account.name = accountName;
        data = JSON.stringify(accounts);
        fs.writeFileSync("accounts.json", data);
        res.send(account);
    } else {
        res.status(404).send(account);
    }
};

const deleteAccount: any = async (req: Request, res: Response) => {
    const id = req.params.id;
    let data = fs.readFileSync(filePath, "utf8");
    let accounts = JSON.parse(data);
    let index = -1;

    for (let i = 0; i < accounts.length; i++) {
        if (accounts[i].id == id) {
            index = i;
            break;
        }
    }
    if (index > -1) {
        const account = accounts.splice(index, 1)[0];
        data = JSON.stringify(accounts);
        fs.writeFileSync(filePath, data);
        res.send(account);
    } else {
        res.status(404).send();
    }
};

const getAccountTokensByAccountId: any = async (req: Request, res: Response) => {
    const id = +req.params.id;
    const content = fs.readFileSync(filePath, "utf8");
    const accounts = JSON.parse(content);
    let account: Account = new Account();
    for (let i = 0; i < accounts.length; i++) {
        if (accounts[i].id == id) {
            account = accounts[i];
            break;
        }
    }

    if (account) {
        res.send(account.token);
    } else {
        res.status(404).send();
    }
};

const createAccountToken: any = async (req: Request, res: Response) => {
    if (!req.body) return res.sendStatus(400);

    const accountId: number = +req.params.id;

    let data = fs.readFileSync(filePath, "utf8");

    const accounts: [Account] = JSON.parse(data);
    let account: Account = new Account();
    for (let i = 0; i < accounts.length; i++) {
        if (accounts[i].id == accountId) {
            account = accounts[i];
            break;
        }
    }

    if (account) {
        account.token = jwt.sign(
            {account_name: account.name},
            secretKey,
            {
                expiresIn: "2h",
            }
        );

        data = JSON.stringify(accounts);
        fs.writeFileSync("accounts.json", data);
        res.send(account);
    } else {
        res.status(404).send(account);
    }
};

const updateAccountToken: any = async (req: Request, res: Response) => {
    if (!req.body) return res.sendStatus(400);

    const accountId = req.params.id
    const accountSourceToken: String = req.body.sourceToken;
    const accountTargetToken: String = req.body.targetToken;

    let data = fs.readFileSync(filePath, "utf8");

    const accounts = JSON.parse(data);
    let account: Account = new Account();
    for (let i = 0; i < accounts.length; i++) {
        if (accounts[i].id == accountId) {
            account = accounts[i];
            break;
        }
    }

    if (account && account.token && account.token == accountSourceToken) {
        account.token = accountTargetToken;
        data = JSON.stringify(accounts);
        fs.writeFileSync("accounts.json", data);
        res.send(account);
    } else {
        res.status(404).send(account);
    }
};

const deleteAccountToken: any = async (req: Request, res: Response) => {
    if (!req.body) return res.sendStatus(400);

    const accountId = req.params.id;
    const accountSourceToken: String = req.body.sourceToken;

    let data = fs.readFileSync(filePath, "utf8");

    const accounts = JSON.parse(data);
    let account: Account = new Account();
    for (let i = 0; i < accounts.length; i++) {
        if (accounts[i].id == accountId) {
            account = accounts[i];
            break;
        }
    }

    if (account && account.token && account.token == accountSourceToken) {
        account.token = "";
        data = JSON.stringify(accounts);
        fs.writeFileSync("accounts.json", data);
        res.send(account);
    } else {
        res.status(404).send(account);
    }
};

export default {
    getAccounts,
    getAccountById,
    createAccount,
    updateAccount,
    deleteAccount,
    getAccountTokensByAccountId,
    createAccountToken,
    updateAccountToken,
    deleteAccountToken
};

