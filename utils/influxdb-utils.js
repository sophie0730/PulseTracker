// repl.repl.ignoreUndefined=true
import dotenv from 'dotenv'
import {InfluxDB, Point} from '@influxdata/influxdb-client'
dotenv.config()

const token = process.env.INFLUXDB_TOKEN
const url = 'http://localhost:8086'

export const client = new InfluxDB({url, token})