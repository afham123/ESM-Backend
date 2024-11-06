import http from "http";
import https from "https";
import logger from "../logger";
import express from 'express'
import controller from '../api'
import {expressMiddleware} from '@apollo/server/express4'
import {ApolloServer} from '@apollo/server'
import { typedef } from "../api/graphql/typedef";
import { resolvers } from "../api/graphql/resolver";
const cors = require("cors");

const app = express();

app.use(
    express.urlencoded({
        limit: "50mb",
        extended: false,
        parameterLimit: 1000000,
    })
);
app.use(express.json({ limit: "50mb" }));
app.use(cors());
async function startgraphqlSever(){
    const apolloServer = new ApolloServer({
        typeDefs : typedef,
        resolvers : resolvers
      })
    await apolloServer.start()
    logger.info('apollo server started')
    app.use('/api/graphql', expressMiddleware(apolloServer))
}


// all assets will be provided from 'public' folder

// views will be provided from 'views' folder
//   app.set('views', path.join(__dirname, '../views'));

// selecting view engine as html
app.set("view engine", "html");

app.use((req: any, res: any, next: any) => {
    // Website you wish to allow to connect
    res.setHeader("Access-Control-Allow-Origin", "*");

    // Request methods you wish to allow
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, OPTIONS, PUT, PATCH, DELETE"
    );

    // Request headers you wish to allow
    res.setHeader(
        "Access-Control-Allow-Headers",
        "X-Requested-With,content-type"
    );

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    // res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.get("/health", (req, res) => {
    logger.info("in health route");
    res.status(200).send("Done");
});

app.post("/playerjoin", async (req, res) => {
    try {
        let { gameId, clientId } = req.body;
        logger.info("body log :::::: ", req.body);

        console.log('PlayerJoinedInGame', gameId, clientId)
    } catch (error) {
        logger.info("error playerjoin---------------", error);

    }
});

app.get("/test", (req, res) => {
    logger.info("in test route");
    res.status(200).send("Done");
});

for (let i = 0; i < controller.length; i++) {
    app.use('/api/', controller[i].router);
}

export let httpServer: http.Server | https.Server;
export const initializeServer = async () => {
    try {
        await startgraphqlSever()
        const { HTTPS_CERT, HTTPS_KEY } = process.env;

        const KeyPath = HTTPS_KEY ? HTTPS_KEY : "";
        const CertPath = HTTPS_CERT ? HTTPS_CERT : "";

        const port =
            process.env.NODE_ENV === "production"
                ? process.env.PROD_PORT
                : process.env.DEV_PORT || 3000;


        logger.info(`[HTTP] connection established successfully ✔ pid : ${process.pid}`);
        httpServer = http.createServer(app);

        httpServer.listen(port, () => {
            logger.info(`Server listening on port : ${port} !`);
        });

    } catch (e) {
        logger.info("error in server ", e);
        throw e;
    }
};