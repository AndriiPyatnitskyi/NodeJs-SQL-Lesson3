/** source/server.ts */
import http from 'http';
import express, {Express} from 'express';
import morgan from 'morgan';
import accountRouter from './routes/accounts';
import tokenRouter from './routes/tokens';
import swaggerUi from 'swagger-ui-express';

const Sequelize = require('sequelize');
const account = require("./model/account");

const swaggerDocument = require('./swagger.json');
const app: Express = express();

/** Init DB */
const sequelize = new Sequelize('postgres://habrpguser:pgpwd4habr@localhost:5432/habrdb') // Example for postgres

sequelize.authenticate()
    .then(() => {
    console.log('Connection has been established successfully.');
}).catch((err: any) => {
    console.error('Unable to connect to the database:', err);
});

// Init tables
const Account = account(sequelize);

Account.sync();

/** Swagger */
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

/** Logging */
app.use(morgan('dev'));
/** Parse the request */
app.use(express.urlencoded({extended: false}));
/** Takes care of JSON data */
app.use(express.json());

/** RULES OF OUR API */
app.use((req, res, next) => {
    // set the CORS policy
    res.header('Access-Control-Allow-Origin', '*');
    // set the CORS headers
    res.header('Access-Control-Allow-Headers', 'origin, X-Requested-With,Content-Type,Accept, Authorization');
    // set the CORS method headers
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET PATCH DELETE POST');
        return res.status(200).json({});
    }
    next();
});

/** Routes */
app.use('/', accountRouter);
app.use('/', tokenRouter);

/** Error handling */
app.use((req, res, next) => {
    const error = new Error('not found');
    return res.status(404).json({
        message: error.message
    });
});

/** Server */
const httpServer = http.createServer(app);
const PORT: any = process.env.PORT ?? 6062;
httpServer.listen(PORT, () => console.log(`The server is running on port ${PORT}`));
