import Sequelize from "sequelize";

module.exports = (sequelize: any) => {
    const AccountModel = sequelize.define('accounts', {
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
    })
    return AccountModel;
};
