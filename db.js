const { Sequelize, DataTypes } = require('sequelize');


// Option 1: Passing a connection URI
// const sequelize = new Sequelize('sqlite::memory:') // Example for sqlite

const sequelize = new Sequelize('postgres://habrpguser:pgpwd4habr@localhost:5432/habrdb') // Example for postgres

// Option 2: Passing parameters separately (sqlite)
// const sequelize = new Sequelize({
//     dialect: 'postgres',
//     storage: '/var/lib/postgresql/data'
// });

// Option 3: Passing parameters separately (other dialects)
// const sequelize = new Sequelize('habrdb', 'habrpguser', 'pgpwd4habr', {
//     host: 'localhost',
//     // dialect: /* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' */
//     dialect: 'postgres'
// });


// try {
//     sequelize.authenticate();
//     console.log('Connection has been established successfully.');
//     // sequelize.close();
// } catch (error) {
//     console.error('Unable to connect to the database:', error);
// }


const Article = sequelize.define("articles", {
    title: {
        type: Sequelize.STRING
    },
    content: {
        type: Sequelize.STRING
    }
});

const User = sequelize.define("users", {
    firstname: {
        type: Sequelize.STRING
    },
    lastname: {
        type: Sequelize.STRING
    }
});

const Test = sequelize.define("tests", {
    testName1: {
        type: Sequelize.STRING
    },
    testName2: {
        type: Sequelize.STRING
    }
});


// await sequelize.sync();


const article =  Article.build({ title: "title1", content: "content1" });
article.save();

const user =  User.build({ firstName: "jane", lastName: "doe" });
user.save()

const test =  Test.build({ testName1: "Test1", testName2: "Test2" });
test.save();


sequelize.sync();

