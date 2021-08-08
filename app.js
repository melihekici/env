const MyClient = require("./myClient");
const Report = require("./report");
const fs = require("fs");

function readJson(file) {
    const data = fs.readFileSync(file);
    const counts = JSON.parse(data);
    return counts;
}

// Read counts.json
const counts = readJson('./files/counts.json');
// Read master.json
const master = readJson('./files/master.json');

async function main() {
    myClient = new MyClient("mongodb://localhost:27017/mydb", "mydb");
    await myClient.connect();
    
    // Delete counts and master collection if exist
    await myClient.deleteCollection('counts');
    await myClient.deleteCollection('master');

    // Create counts and master collections
    await myClient.createCollection('counts');
    await myClient.createCollection('master');

    // Add json records to the counts and master collections
    await myClient.addRecords('counts', counts);
    await myClient.addRecords('master', master);

    // Get the reports
    const reporter = new Report(myClient);
    await reporter.get_reports();

    await myClient.closeConnection();
    return;
}

main()