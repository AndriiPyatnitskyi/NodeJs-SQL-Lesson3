import {Request} from "express"
import {Account} from "../model/account";

export interface UserAuthInfoRequest extends Request {
    user: Account;
}
