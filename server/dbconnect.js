const Pool = require('pg').Pool
const jwt = require('jsonwebtoken');
const jwtaccesskey = 'keemia-secret';

const pool = new Pool({
    user: 't193094',
    host: 'dev.vk.edu.ee',
    database: 'KeemiaProject2',
    password: 't193094',
    port: 5432,
});

const UserAuthentication = async (req, res) => {
    try {
        const { addressLog, passLog } = req.body;
        const res1 = await pool.query("SELECT userid, username, address FROM users WHERE address = $1 AND pass = $2", [addressLog, passLog]);
        const result = res1.rows;
        if (result.length != 0) {
            jwt.sign({ res1 }, jwtaccesskey, { expiresIn: "2h" }, (err, accesstoken) => {
                if (err) {
                    res.json("Something went wrong")
                }
                res.send({ result, auth: accesstoken });
                //res.send(result);
            });
        }
        else {
            res.json("Username or password incorrect")
        }

    } catch (err) {
        res.json(err.message);
    }
};

const UserRegistration = async (req, res) => {
    const { addressReg, passReg, usernameReg } = req.body;
    try {
        await pool.query("INSERT INTO users (address,pass,username) VALUES ($1,$2,$3)", [addressReg, passReg, usernameReg]);
    } catch (err) {
        res.json(err.message);
    }
};

const GetChemElement = async (req, res) => {
    try {
        const res2 = await pool.query("SELECT name FROM substancedata");
        res.json(res2.rows)
    } catch (err) {
        res.json(err.message);
    }
};

const SearchElementbyName = async (req, res) => {
    try {
        const { name } = req.params;
        const res2 = await pool.query("SELECT * FROM substancedata WHERE  LOWER(name) like '%' || LOWER($1) || '%' ORDER BY elementnumber ASC", [name]);
        res.json(res2.rows)
    } catch (err) {
        res.json(err.message);
    }
};

const GetAllElements = async (req, res) => {
    try {
        const res2 = await pool.query("SELECT * FROM substancedata ORDER BY elementnumber ASC");
        res.json(res2.rows)
    } catch (err) {
        res.json(err.message);
    }
};

const AddNewElement = async (req, res) => {
    try {
        const { elementnumAdd, elementnameAdd, casAdd, formulaAdd, unitsAdd, typeAdd, qtyAdd, useridAdd } = req.body;
        await pool.query("INSERT INTO substance VALUES (default,$1,$2,$3,$4,$5,$6)", [elementnumAdd, elementnameAdd, casAdd, formulaAdd, unitsAdd, typeAdd]);
        await pool.query("INSERT INTO addchemicalelements(addid,dateadd,qty,userid,substanceid) VALUES (default,current_date,$1,$2,(SELECT max(substanceid) FROM substance))", [qtyAdd, useridAdd]);
    } catch (err) {
        res.json(err.message);
    }
};

const UpdateElementStatus = async (req, res) => {
    try {
        const { addidUpd } = req.params;
        const res3 = await pool.query("UPDATE addchemicalelements SET status = 0 WHERE status = 1 and addid = $1", [addidUpd]);
        res.json("Was updated!");
    } catch (err) {
        console.error(err.message);
    }
};

const AddElementToSpendTable = async (req, res) => {
    try {
        const { commentDel, addidUpd, useridAdd } = req.body;
        await pool.query("INSERT INTO chemicalelementsspend VALUES(default,current_date,$1,$2,(SELECT substanceid from substance WHERE substanceid=$3),(SELECT addid from addchemicalelements WHERE substanceid=$3))", [commentDel, useridAdd, addidUpd]);
    } catch (err) {
        res.json(err.message);
    }
};

const GetDeletedElements = async (req, res) => {
    try {
        const res4 = await pool.query("SELECT * FROM substancedeletedata ORDER BY elementnumber ASC");
        res.json(res4.rows)
    } catch (err) {
        res.json(err.message);
    }
};

const ClearDeletedElementsTable = async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query("DELETE FROM chemicalelementsspend WHERE substanceid = $1", [id]);
        await pool.query("DELETE FROM addchemicalelements WHERE substanceid = $1", [id]);
        await pool.query("DELETE FROM substance WHERE substanceid = $1", [id]);
        res.json("Was deleted!");
    } catch (err) {
        console.log(err.message);
    }
};

function verityToken(req,resp,next){
    let token = req.headers['authorization'];
    if(token){
        token = token.split(' ')[1];
        jwt.verify(token,jwtaccesskey,(err,valid)=>{
            if(err){
                resp.status(401).send({result: 'Please provide valid token'})
            }else{
                next();
            }
        })
    }else{
        resp.status(401).send({result: 'Please provide token'})
    }
}


module.exports = {
    UserAuthentication,
    UserRegistration,
    verityToken,
    GetChemElement,
    SearchElementbyName,
    GetAllElements,
    AddNewElement,
    UpdateElementStatus,
    AddElementToSpendTable,
    GetDeletedElements,
    ClearDeletedElementsTable
};
