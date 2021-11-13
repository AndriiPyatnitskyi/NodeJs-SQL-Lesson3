class Account {
    id  : number;
    name: String;
    token: String;
    role: Role;
}

enum Role {
    USER = "USER", ADMIN = "ADMIN"
}

export { Account, Role };
