const express = require('express')
const app = express()
const path = require('path')
const bodyParser = require('body-parser')
const GoogleSpreadsheet = require('google-spreadsheet')
const credentials = require('./bugtracker.json')
const sgMail = require('@sendgrid/mail')
const { promisify } = require('util')


const docId = '1VwZHSum38dGiI75Y6IUpP3GbDeB58bMoKf4_BpSrOYc';
const worksheetIndex = 0; 
const sendGridKey = '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'


app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.render('home')
})

app.post('/', async (req, res) => {
    try {
        const doc = new GoogleSpreadsheet(docId)
        await promisify(doc.useServiceAccountAuth)(credentials)
        const info = await promisify(doc.getInfo)()
        const worksheet = info.worksheets[worksheetIndex]
        await promisify(worksheet.addRow)({ 
            nome: req.body.name, 
            email: req.body.email,
            userAgent: req.body.userAgent,
            userDate: req.body.userDate,
            issueType: req.body.issueType,
            howToReproduce: req.body.howToReproduce,
            expectedOutput: req.body.expectedOutput,
            receivedOutput: req.body.receivedOutput,
            source: req.query.source || 'direct'
        })

        if (req.body.issueType === 'CRITICAL') {
            sgMail.setApiKey(sendGridKey);
            const msg = {
                to: 'abe.nami0510@gmail.com',
                from: 'abe.nami0510@gmail.com',
                subject: 'Bug crítico reportado',
                text: `O usuário ${req.body.name} reportou um problema.`,
                html:  `O usuário ${req.body.name} reportou um problema.`,
            };
            await sgMail.send(msg);
        }

        res.render('success') 
    } catch (err) {
        res.send('Erro ao enviar formulário')   
        console.log(err);
             
    }
})

app.listen(3000, err => {
    if (err) {
        console.log('aconteceu um erro', err); 
    } else {
        console.log('bugtracker rodando na porta 3000');
        
    }
});