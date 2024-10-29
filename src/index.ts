import "dotenv/config";
import logger from "./logger";
import mongodb from "./services/database";

import express from "express";

import { initializeServer } from "./services/server.service";
process.env.TZ = "Asia/Calcutta";

const cbSuccess = (message: string) => () => logger.info(`Operation successfull : ${message}`);
const cbFailure = (message: string) => (err: any) => {
    console.log(`Operation failed : ${message} : ${err.message}`)
    process.exit(0);
};

(async () => {
    try {
        console.log("Starting server...");
        // Lock.init();

        initializeServer()
            .then(cbSuccess('Server started'))
            .catch(cbFailure('Server failed to start'));
            
        connectToTheDatabase()
            .then(cbSuccess('Database connection established'))
            .catch(cbFailure('Database connection failed'));

        console.log('server started')
        logInfo();

    } catch (error) {
        console.log('fail to start the server', error);
    }
})();
async function connectToTheDatabase() {
    logger.info('connecting to the database called');
    await mongodb.init();
}


function logInfo() {
    if (process.env.NODE_ENV !== 'production') {
        const mydate = new Date();
        const newFilename = mydate.getFullYear() + '-' + (mydate.getMonth() + 1) + '-' + mydate.getDate();
        console.log('Logging : ', __dirname + `\\..\\logs\\${newFilename}.log`)
    }
}
process
    .on("unhandledRejection", (reason, p) => {
        console.log(
            reason,
            `Unhandled Rejection at Promise >> ${new Date()} >> \n`,
            p
        );
    })
    .on("uncaughtException", (err) => {
        console.log(`Uncaught Exception thrown on ${new Date()} >> \n`, err);
        process.exit(1);
    });