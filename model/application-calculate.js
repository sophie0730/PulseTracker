import * as fs from 'fs';
import * as path from 'path';
import dotenv from 'dotenv';
dotenv.config();

const LOG_FILE_PATH = '/var/log/nginx/access.log';

export async function getNginxAccessLog() {
    return new Promise((resolve, reject) => {
        fs.readFile(path.resolve(LOG_FILE_PATH), 'utf-8', (err, data) => {
            console.log('hi')
            if (err) {
                console.err('Error from log file:', err);
                reject(err);
                return;
            }
            const totalRequest = processLogData(data);
            
            resolve(totalRequest);
        })
    })


}


function processLogData(logData) {
    console.log(logData)
    const lines = logData.split('\n');
    let httpTotalRequest = 0;

    for (let i = 0; i < lines.length; i++) {
        if (!lines[i]) continue;
        httpTotalRequest++;
    }
    return httpTotalRequest;

}