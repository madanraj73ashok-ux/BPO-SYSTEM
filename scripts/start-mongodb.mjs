import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import { MongoMemoryServer } from 'mongodb-memory-server'

const dbPath = path.resolve('.mongodb-data')

await mkdir(dbPath, { recursive: true })

const mongod = await MongoMemoryServer.create({
  instance: {
    dbName: 'bpo_system',
    dbPath,
    ip: '127.0.0.1',
    port: 27017,
    storageEngine: 'wiredTiger',
  },
})

console.log(`MongoDB is running at ${mongod.getUri('bpo_system')}`)
console.log(`Data directory: ${dbPath}`)

const shutdown = async () => {
  await mongod.stop()
  process.exit(0)
}

process.once('SIGINT', shutdown)
process.once('SIGTERM', shutdown)
