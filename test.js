import testConsoleLog from "./testFunction";

const express = require('express')
const Sequelize = require('sequelize')
const app = express()
const port = 3000;


app.use(express.json());

// const sequelize = new Sequelize('postgres://user:pass@example.com:5432/dbname')
// const sequelize = new Sequelize('postgres://postgres:alfa2021@localhost:5432/postgres')
const sequelize = new Sequelize('postgres://habrpguser:pgpwd4habr@localhost:5432/habrdb') // Example for postgres


sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
}).catch(err => {
    console.error('Unable to connect to the database:', err);
});

const User = sequelize.define('user', {
    // attributes
    firstName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    lastName: {
        type: Sequelize.STRING
        // allowNull defaults to true
    }
}, {
// options
});

// Note: using `force: true` will drop the table if it already exists
// User.sync({ force: true }) // Now the `users` table in the database corresponds to the model definition
User.sync() // Now the `users` table in the database corresponds to the model definition

app.get('/', (req, res) => res.json({ message: 'Hello World' }))
// app.get('/users', (req, res) => {
//     .findAll({
//         where: {
//           authorId: {
//             [Op.eq]: 2
//           }
//         }
//       });
// })


app.post('/user', async (req, res) => {
    try {
        console.log('request:: ', req.body);

        const newUser = new User(req.body);
        console.log('New user: ', newUser);
        await newUser.save();

        res.json({ user: newUser }) // Returns the new user that is created in the database
    } catch(error) {
        console.error(error);
        res.status(500).send(error) // Returns the new user that is created in the database
    }
});

app.get('/user/:userId', async (req, res) => {
    const userId = req.params.userId
    try {
        const user = await User.findAll({
            where: {
                id: userId
            }
        })
        res.json({ user })
    } catch(error) {
        console.error(error);
        res.status(500).send(error) // Returns the new user that is created in the database
    }
})

process.on('SIGINT', () => {
    console.log('SIGINT');
    sequelize.close();
    process.exit(0);
});

process.on('SIGQUIT', () => {
    console.log('SIGQUIT');
    sequelize.close();
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('SIGTERM');
    sequelize.close();
    process.exit(0);
})

process.on('uncaughtException', (error) => {
    console.log('uncaughtException:', error);
    sequelize.close();
    process.exit(0);
})

process.on('unhandledRejection', () => {
    console.log('unhandledRejection');
    sequelize.close();
    process.exit(0);
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
