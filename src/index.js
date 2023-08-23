import express from 'express';
import bodyParser from 'body-parser';
import viewEngine from './config/viewEngine';
import initWebRoutes from './route/web';
import sequelize from './config/connectDB';
import cors from 'cors';

require('dotenv').config();

let app = express();
app.use(cors({ origin: true }));

//config app
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
viewEngine(app);
initWebRoutes(app);

async function connectDB() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

connectDB();

const port = process.env.PORT || 8081;

app.listen(port, () => {
    console.log(`Hello World on port ${port}`);
});
