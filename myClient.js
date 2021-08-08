var MongoClient = require('mongodb').MongoClient;


class MyClient {
    constructor(uri, db) {
        this.uri = uri;
        this.db = db;
        this.client = new MongoClient(uri);
    }

    async connect() {
        await this.client.connect();
        console.log("Connected");
        return;
    }

    async createCollection(collectionName) {
        await this.client.db(this.db).createCollection(collectionName, (err, db) => {
            console.log(`Collection created with name ${collectionName}`);
        })
        return;
    }

    async addRecords(collectionName, records) {
        records.forEach(element => {
            element["_id"] = element["id"];
            delete element.id
        });
        const result = await this.client.db(this.db).collection(collectionName).insertMany(records);
        return result
    }

    async getRecords(collectionName, filter=null) {
        const result = await this.client.db(this.db).collection(collectionName).find(filter).toArray();
        return result;
    }

    async deleteCollection(collectionName) {
        await this.client.db(this.db).collection(collectionName).drop((err, res) => {
            if(res) console.log(`Collection ${collectionName} deleted.`)
        })
        return;
    }

    async closeConnection() {
        await this.client.close();
        return;
    }
}

module.exports = MyClient;