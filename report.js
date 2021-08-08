const fs = require("fs");

class Report {
    constructor(client) {
        this.lbaReport = null;
        this.baReport = null;
        this.client = client;
    }

    async location_bar_amount_report() {
        let report = []
        let counts = (await this.client.getRecords('counts'))

        const outFile = 'Location-Barcode-Amount-Report.txt';
        fs.writeFileSync(outFile, "location;barcode;amount\n");
    
        counts.forEach(element => {
            element.completedCounts.forEach(completedCount => {
                completedCount.contents.forEach(content => {
                        fs.writeFileSync(outFile, `${element.locationCode};${content.barcode};${content.amount}\n`, {flag: 'a'});
                        report.push({"location" : element.locationCode, "barcode" : content.barcode, "amount" : content.amount})
                })
            });
        });
    
        this.lbaReport = report;
    }

    async bar_amount_report() {
        let baReport = {};
        const outFile = 'Barcode-Amount-Report.txt';
        fs.writeFileSync(outFile, "barcode;amount\n");
    
        this.lbaReport.forEach(element => {
            if(element.barcode in baReport){
                baReport[element.barcode] += element.amount;
            }else {
                baReport[element.barcode] = element.amount;
            }
        })
    
        
        for (const [key, value] of Object.entries(baReport)) {
            fs.writeFileSync(outFile, `${key}:${value}\n`, {flag: 'a'});
        }
    
        this.baReport = baReport;
    }

    async aggregatedReport() {
        const outFile = "Aggregated-Report.txt";
        fs.writeFileSync(outFile, "location;barcode;amount;sku;urun adi\n");

        for (const element of this.lbaReport) {
            const rep = (await this.client.getRecords('master', {'barcode':element.barcode}))[0]
            fs.writeFileSync(outFile, `${element.location};${element.barcode};${element.amount};${rep.sku};${rep['urun adi']}\n`, {flag: 'a'});
        }

        return;
    }

    async get_reports() {
        await this.location_bar_amount_report();
        await this.bar_amount_report();
        await this.aggregatedReport();
        return;
    }
}

module.exports = Report;