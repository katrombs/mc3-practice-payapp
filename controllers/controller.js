const db = require('../models/db.js');
const Transaction = require('../models/TransactionModel.js');

const controller = {

    getFavicon: function (req, res) {
        res.status(204);
    },

    /*
    TODO:   This function is executed when the client sends an HTTP GET
            request to path `/`. This displays `index.hbs` with all
            transactions currently stored in the database.
    */
    getIndex: async function(req, res) {
        // your code here
        // var query = {name: req.body.name, refno: req.body.refno, amount: req.body.amount};

        var projection = 'name refno amount';

        var result = await db.findMany(Transaction, {}, projection);
        
        if(result != null){
            var details = {
                // transactions: (result.name, result.refno, result.amount)
                transactions: result,
                name: result.name,
                refno: result.refno,
                amount: result.amount
            };
            
        }
        console.log(result);
        console.log(details.transactions);
        console.log(result.name);
        console.log(result.refno);
        console.log(result.amount);


        res.render('index', details); // This is to load the page initially
    },

    /*
    TODO:   This function is executed when the client sends an HTTP GET
            request to path `/getCheckRefNo`. This function checks if a
            specific reference number is stored in the database. If the number
            is stored in the database, it returns an object containing the
            reference number, otherwise, it returns an empty string.
    */
    getCheckRefNo: async function(req, res) {
        // your code here
        var query = {refno: req.query.refno};
        var projection = 'refno';

        var result = await db.findOne(Transaction, query, projection);

        res.send(result);
    },

    /*
    TODO:   This function is executed when the client sends an HTTP GET
            request to path `/getAdd`. This function adds the transaction
            sent by the client to the database, then appends the new
            transaction to the list of transactions in `index.hbs`.
    */
    getAdd: async function(req, res) {
        // your code here
        var name = req.query.name;
        var refno = req.query.refno;
        var amount = req.query.amount;

        console.log('name: ' + name);
        console.log('refno: ' + refno);
        console.log('amount: ' + amount);

        var transaction = {
            name: name,
            refno: refno,
            amount: amount
        }

        var response = await db.insertOne(Transaction, transaction);

        if(response != null){
            res.render('partials/card', transaction, async function (err, html) {
                await res.send(html);
            });
        }

    },

    /*
    TODO:   This function is executed when the client sends an HTTP GET
            request to path `/getDelete`. This function deletes the transaction
            from the database, then removes the transaction from the list of
            transactions in `index.hbs`.
    */
    getDelete: async function (req, res) {
        // your code here
        var refno = req.query.refno;

        var deleteCard = await db.deleteOne(Transaction, {refno: refno});
        res.send(deleteCard);
    }

}

module.exports = controller;
