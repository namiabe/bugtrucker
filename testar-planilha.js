const GoogleSpreadsheet = require('google-spreadsheet')
const credentials = require('./bugtracker.json')
const { promisify } = require('util')


const addRowToSheet = async () => {
    const doc = new GoogleSpreadsheet('1VwZHSum38dGiI75Y6IUpP3GbDeB58bMoKf4_BpSrOYc')
    await promisify(doc.useServiceAccountAuth)(credentials)
    console.log('planilha aberta');
    const info = await promisify(doc.getInfo)()
    const worksheet = info.worksheets[0]
    await promisify(worksheet.addRow)({ nome: 'Nádia', email: 'teste' })
}

addRowToSheet()

/*
doc.useServiceAccountAuth(credentials, (err) => {
    if(err) {
        console.log('não foi possivel abrir a planilha');
    } else {
        console.log('planilha aberta');
        doc.getInfo((err, info) => {
            const worksheet = info.worksheets[0]
            worksheet.addRow({ name: 'Nádia', email: 'teste', issueType: 'aaa', howToReproduce: 'bb', expectedOutput: 'cc', receivedOutput: 'dd' }, err =>{
             console.log('linha inserida');
            })
            
        })        
    }
})
*/

