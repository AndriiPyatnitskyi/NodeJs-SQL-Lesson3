import {Request} from "express"
import {Account} from "../dto/account";

export interface UserAuthInfoRequest extends Request {
    user: Account;
}
