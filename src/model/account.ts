import Sequelize from "sequelize";

const account = (sequelize: any) => {
    return sequelize.define('accounts', {
    // attributes
    name: {
        type: Sequelize.STRING
    },
    token: {
        type: Sequelize.STRING
    },
    role: {
        type: Sequelize.STRING
    },
}, {
// options
})};

module.exports = account;

