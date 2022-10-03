const express = require('express');
const cors = require('cors');
const app = express();
const port =3000;
const swaggerJsdoc = require('swagger-jsdoc'); 
const swaggerUi = require('swagger-ui-express');
const bodyParser = require('body-parser');
app.use(cors());

const { body } = require('express-validator');

validateUpdateCompany = [body('COMPANY_ID', 'company id cannot be empty').notEmpty().trim().escape(),
body('COMPANY_NAME', 'Company Name cannot be empty').notEmpty().trim().escape(),
body('COMPANY_CITY', 'Company city cannot be empty').notEmpty().trim().escape()]

const options ={
definition:{
    openapi: "3.0.0",
	info:{
		title: "Personal API",
		version: "1.0.0",
		description:'Simple Api'
	},
	servers:[
	{
		url:"http://localhost:3000",
		description:"My Api"
	},
	],
},
	apis: ['./server.js'],
};

const specs = swaggerJsdoc(options);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use(bodyParser.urlencoded({ extended: true}));
app.use(express.json())
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  });
const mariadb = require('mariadb');
const pool = mariadb.createPool({
     host:'127.0.0.1',
     user:'root',
     password:'root',
     database: 'sample',
     port: 3306,
     connectionLimit: 5
});

console.log('Conected');

module.exports = pool;

/**
 * @swagger
 * components:
 *   schemas:
 *     Customers:
 *       type: object
 *       required:
 *         - CUST_CODE
 *         - CUST_NAME
 *         - CUST_CITY
 *       properties:
 *         CUST_CODE:
 *           type: string
 *           description: The Auto-generated id of a customer
 *         CUST_NAME:
 *          type: string
 *          description: Name of customer
 *         CUST_CITY:
 *          type: string
 *          description: city of the customer
 *         WORKING_AREA:
 *           type: string
 *           description: Working area of customer
 *         CUST_COUNTRY:
 *          type: string
 *          description: country of the customer
 *         GRADE:
 *          type: integer
 *          description: Grade type of the customer
 *         OPENING_AMT:
 *          type: integer
 *          description: opening amount of customer
 *         RECEIVE_AMT:
 *           type: integer
 *           description: receive amount of customer
 *         PAYMENT_AMT:
 *           type: integer
 *           description: payment amount of customer
 *         OUTSTANDING_AMT:
 *           type: integer
 *           descripton: outstanding amount of customer
 *         PHONE_NO:
 *           type: string
 *           descripton: phone no of customer
 *         AGENT_CODE:
 *           type: string
 *           descripton: agent code of customer
 *       example:
 *         CUST_CODE: C00020
 *         CUST_NAME: Brendon
 *         CUST_CITY: London
 *         WORKING_AREA: London
 *         CUST_COUNTRY: UK
 *         GRADE: 2
 *         OPENING_AMT: 7000.00
 *         RECEIVE_AMT: 5000.00
 *         PAYMENT_AMT: 8000.00
 *         OUTSTANDING_AMT: 4000.00
 *         PHONE_NO: FDEDFED
 *         AGENT_CODE: A002
 *     Companys:
 *       type: object
 *       required:
 *         - COMPANY_ID
 *         - COMPANY_NAME
 *         - COMPANY_CITY
 *       properties:
 *         COMPANY_ID:
 *           type: string
 *           description: ID of the company
 *         COMPANY_NAME:
 *           type: string
 *           description: Name of the company
 *         COMPANY_CITY:
 *           type: string
 *           description: City of the company
 */

/**
 * @swagger
 * /customers:
 *   get:
 *     summary: Returns all the Customers
 *     responses:
 *       200:
 *         description: the list of the Customers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Customers'
 */


app.get('/customers',async function(req,res){
try{
	const sqlquery = 'SELECT * FROM customer';
    const result = await pool.query(sqlquery,req.params.id);
	res.json(result)
}
catch(error){res.status(400).send(error.message)}
});

/**
 * @swagger
 * /companys:
 *   get:
 *     summary: Returns all the Companys
 *     responses:
 *       200:
 *         description: the list of the Companys
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Companys'
 */


 app.get('/companys',async function(req,res){
    try{
        const sqlquery = 'SELECT * FROM company';
        const result = await pool.query(sqlquery,req.params.id);
        res.json(result)
    }
    catch(error){res.status(400).send(error.message)}
    });
    

/**
 * @swagger
 * /customers/{id}:
 *   get:
 *     summary: gets customer by id
 *     parameters:
 *       - in : path
 *         name: id
 *         description: id of customer
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Customer found by id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Customers'
 *       400:
 *         description: Customer can not be found
 */

app.get('/customers/:id',async function(req,res){
try{
        const sqlquery = 'SELECT * FROM customer WHERE CUST_CODE = ?';
        const result = await pool.query(sqlquery,req.params.id);
        res.status(200).json(result)

}
catch(error){res.status(400).send(error.message)}

});

/**
 * @swagger
 * /companys:
 *   post:
 *     summary: Create a new company record
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Companys'
 *     responses:
 *       200:
 *         description: The Company  inserted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Companys'
 *       500:
 *         description: Server error
 */

app.post("/companys", validateUpdateCompany, async function (req, res) {
    let company = req.body;
    try {
        const sqlquery ='insert into company (COMPANY_ID,COMPANY_NAME,COMPANY_CITY) values (?,?,?)';
        const result = await pool.query(sqlquery, [company.COMPANY_ID, company.COMPANY_NAME, company.COMPANY_CITY]);
        res.sendStatus(200);
    } catch (error){res.status(400).send(error.message)}
});

/**
 * @swagger
 *  /customers/{name}:
 *    delete:
 *      parameters:
 *        - in: path
 *          name: name
 *          description: delete customer by name
 *          required: true
 *          schema:
 *            type: string
 *      responses:
 *        200:
 *          description: The Customer was deleted
 *        404:
 *          description: The Customer was not found
 *
 */
 app.delete("/customers/:id", async function (req, res) {
    try {
        const sqlquery ='delete FROM customer where CUST_NAME = ?'
        let result = await pool.query(sqlquery, req.params.id);
        res.sendStatus(200);
    } 
        catch (error){res.status(400).send(error.message)}

});

/**
 * @swagger
 * /companys:
 *   put:
 *     summary: update a company record
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Companys'
 *     responses:
 *       200:
 *         description: The Company record inserted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Companys'
 *       500:
 *         description: Server error
 */
app.put("/companys", async function (req, res) {
    let company = req.body;
    try {
        const sqlquery ='update company set COMPANY_NAME = ? ,COMPANY_CITY = ? where COMPANY_ID = ?'
        const result = await pool.query(sqlquery, [company.COMPANY_NAME, company.COMPANY_CITY, company.COMPANY_ID]);
        res.sendStatus(200);
    } catch (error){res.status(400).send(error.message)}
})

/**
 * @swagger
 * /companys/{name}:
 *   patch:
 *     summary: update company records
 *     parameters:
 *       - in: path
 *         name: id
 *         description: update company by name
 *         required: true
 *         schema:
 *            type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Companys'
 *     responses:
 *       200:
 *         description: Update company record
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Companys' 
 *       500:
 *         description: Server error
 */
app.patch("/companys/:name", async function (req, res) {
    let company = req.body;
    try {
        const sqlquery = 'update company set COMAPNY_ID = ? , COMPANY_CITY = ?, where COMPANY_NAME = ?';
        const result = await pool.query(sqlquery, [company.COMPANY_ID, company.COMPANY_CITY, request.params.name]);
        res.sendStatus(200);
    } catch (error){res.status(400).send(error.message)}
})






app.get('/getcustomer/:city',async function(req,res){
try{
	
	const sqlquery = 'SELECT * FROM customer WHERE CUST_CITY = ?';
	const result = await pool.query(sqlquery,req.params.city);
	res.status(200).json(result)
		
}
catch(error){res.status(400).send(error.message)}

});

app.get('/getorders/:amount',async function(req,res){
try{

        const sqlquery = 'SELECT * FROM orders WHERE ORD_AMOUNT <  ?';
        const result = await pool.query(sqlquery,req.params.amount);
        res.status(200).json(result)

}
catch(error){res.status(400).send(error.message)}

});

app.get('/getstudentreport/:grade',async function(req,res){
try{

        const sqlquery = 'SELECT * FROM studentreport WHERE GRADE =  ?';
        const result = await pool.query(sqlquery,req.params.grade);
        res.status(200).json(result)

}
catch(error){res.status(400).send(error.message)}

});


app.listen(port, () =>{
	console.log(`API Served at http://localhost:${port}`)
})

