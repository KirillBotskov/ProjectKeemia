const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const app = express()
const db = require('./dbconnect')
const port = process.env.port || 5000;

app.use(cors())
app.use(bodyParser.json())
app.set('json spaces', 2)

// http://localhost:5000/keemia/user/authentication/:address/:pass
app.get('/keemia/user/authentication/:addressLog/:passLog', db.UserAuthentication);

// http://localhost:5000/keemia/user/registration
app.post('/keemia/user/registration', db.UserRegistration);

// http://localhost:5000/keemia/get/element/:name
app.get('/keemia/get/element/:name', db.SearchElementbyName);

// http://localhost:5000/keemia/get/all/elements
app.get('/keemia/get/all/elements', db.GetAllElements);

// http://localhost:5000/keemia/add/element
app.post('/keemia/add/element', db.AddNewElement);

// http://localhost:5000/keemia/update/element/status/:addidUpd
app.put('/keemia/update/element/status/:addidUpd', db.UpdateElementStatus);

// http://localhost:5000/keemia/add/elements/spendtable
app.post('/keemia/add/elements/spendtable', db.AddElementToSpendTable);

// http://localhost:5000/keemia/deletechemlist
app.get('/keemia/get/deleted/elements', db.GetDeletedElements);

// http://localhost:5000/keemia/clear/deleted/elements/table/:id
app.delete('/keemia/clear/deleted/elements/table/:id', db.ClearDeletedElementsTable);


app.listen(port, () => {
    console.log(`App running on port ${port}.`)
})