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
    const result = await models.default.AccountModel.findByPk(req.params.id);

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

    let result = await models.default.AccountModel.update(
        {
            name: req.body.name
        },
        {
            where: {
                id: req.params.id
            }
        });

    if (result == 1) {
        res.send(await models.default.AccountModel.findByPk(req.params.id));
    } else {
        res.status(404).send(req.params.id);
    }
};

const deleteAccount: any = async (req: Request, res: Response) => {
    let result = await models.default.AccountModel.destroy(
        {
            where: {
                id: req.params.id
            }
        });

    if (result == 1) {
        res.sendStatus(204);
    } else {
        res.status(404).send();
    }
};

const getAccountTokensByAccountId: any = async (req: Request, res: Response) => {
    const result = await models.default.AccountModel.findByPk(req.params.id);

    if (result) {
        res.send(result.token);
    } else {
        res.status(404).send();
    }
};

const createAccountToken: any = async (req: Request, res: Response) => {
    if (!req.body) return res.sendStatus(400);

    const account = await models.default.AccountModel.findByPk(req.params.id);

    if (!account) {
        res.status(404).send(req.params.id);
    }

    const updated = await models.default.AccountModel.update(
        {
            token: jwt.sign(
                {account_name: account.name},
                secretKey,
                {
                    expiresIn: "2h",
                }
            )
        },
        {
            where: {
                id: req.params.id
            }
        });

    if (updated == 1) {
        res.send(await models.default.AccountModel.findByPk(req.params.id));
    } else {
        res.sendStatus(500);
    }
};

const updateAccountToken: any = async (req: Request, res: Response) => {
    if (!req.body) return res.sendStatus(400);

    const accountSourceToken: String = req.body.sourceToken;
    const accountTargetToken: String = req.body.targetToken;

    const account = await models.default.AccountModel.findByPk(req.params.id);

    if (!account) {
        res.status(404).send(req.params.id);
    }

    if (account.token !== accountSourceToken) {
        res.status(404).send(req.params.id);
    }


    const updated = await models.default.AccountModel.update(
        {
            token: accountTargetToken
        },
        {
            where: {
                id: req.params.id,
                token: accountSourceToken
            }
        });

    if (updated == 1) {
        res.send(await models.default.AccountModel.findByPk(req.params.id));
    } else {
        res.sendStatus(500);
    }
};

const deleteAccountToken: any = async (req: Request, res: Response) => {
    if (!req.body) return res.sendStatus(400);

    const account = await models.default.AccountModel.findByPk(req.params.id);

    if (!account) {
        res.status(404).send(req.params.id);
    }

    const updated = await models.default.AccountModel.update(
        {
            token: ""
        },
        {
            where: {
                id: req.params.id
            }
        });


    if (updated == 1) {
        res.send(await models.default.AccountModel.findByPk(req.params.id));
    } else {
        res.sendStatus(500);
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

