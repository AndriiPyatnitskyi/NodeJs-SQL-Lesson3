import {Response} from "express";
import {Account, Role} from "../dto/account";
import {UserAuthInfoRequest} from "../types/userAuthInfoRequest";

const jwt = require("jsonwebtoken");

const secretKey = "mySecretKey";

const permit = (permittedRoles: [Role]) => {
    return (req: UserAuthInfoRequest, res: Response, next: any) => {

        if (permittedRoles.includes(Role.ANONYMOUS)) {
            next();
        } else {
            const token = req.body?.token || req.query.token || req.headers["x-access-token"];

            if (!token) {
                return res.status(403).send("A token is required for authentication");
            }

            let user: Account;
            try {
                user = jwt.verify(token, secretKey);
            } catch (err) {
                return res.status(401).send("Invalid Token");
            }

            if (permittedRoles.includes(user.role)) {
                next(); // role is allowed, so continue on the next middleware
            } else {
                res.status(403).json({message: "Forbidden. Role isn't allowed."}); // user is forbidden
            }
        }
    }
}

module.exports = permit;
