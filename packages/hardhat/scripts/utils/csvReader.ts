import { parse } from 'csv-parse'
import fs from 'fs'

const readCsv = async (file: any) => {
    let records = []
    const parser = fs
    .createReadStream(file)
    .pipe(parse({ columns: true, delimiter: ',' }))
    parser.on('error', function(err){
      console.error(err.message)
    })
    for await (const record of parser) {
      records.push(record.WalletAddress)
    }
    console.log(records)
    return records
  }
  
export default readCsv