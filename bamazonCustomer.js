var inquirer = require('inquirer');
var colors = require('colors');
var Table = require('cli-table');
var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'teecup26',
    database: 'bamazon_db',
});
connection.connect(function(err) {
    if (err) throw err;
    //console.log('connected as id' + connection.threadId);
});

forCustomer();


function forCustomer() {
    connection.query('SELECT * FROM products', function(err, res) {
        //console.log(res);

        var table = new Table({
            head: ['ID#'.cyan, 'Product'.blue, 'Price'.blue, 'Department'.blue],
            colWidths: [6, 50, 10, 25]
        });

        for (var i = 0; i < res.length; i++) {
            table.push([res[i].ID, res[i].ProductName, '$' + res[i].Price, res[i].DepartmentName]);
        }

        console.log('\n' + table.toString());


        inquirer.prompt({
            type: 'input',
            name: 'id',
            message: 'What would you like to purchase? \nPlease provide the ID number of the item you would like to purchase...'
                // validate: function(){
                // 	id number has to be within range of current db ID numbers
                // }

            }).then(function(res) {

            //find item that corresponds with the ID number
            connection.query('SELECT * FROM products WHERE ID =' + res.id, function(err, response) {
                if (err) {
                    console.log('im sorry, that product ID does not exist');
                    //--------how to return back to the prompt??
                }
                var departmentName = response[0].DepartmentName;
                var numInStock = response[0].StockQuantity;
                var price = response[0].Price;
                var itemName = response[0].ProductName;

                inquirer.prompt([{
                    name: 'itemNum',
                    type: 'input',
                    message: 'How many items of this selection would you like?',
                    validate: function(value) {
                        var tempNum = value;
                        tempNum = tempNum.split(',').join('');
                        if (isNaN(tempNum) == false) {
                            return true;
                        } else {
                            return false;
                        }
                    }
                }]).then(function(number) {
                    var newItemNum = number.itemNum;
                    newItemNum = newItemNum.split(',').join('');
                    if (newItemNum > numInStock) {
                        console.log('Sorry we do not have enough items, we currently have ' + numInStock + ' in stock.');
                        return false;
//--------how to return to the prompt to ask the question again for right amount of items?
}
                    //updating stockQuanitity from products_db
                    connection.query('UPDATE products SET StockQuantity = StockQuantity -' + newItemNum + ' WHERE ID = ' + res.id, function(err, response) {
                        if (err) {
                            console.log('there was an error with your purchase');
                            console.log(err);
                            return;
                        }
                        var totalPrice = Math.round((newItemNum * price) * 100) / 100;

                        console.log(newItemNum + ' item(s) were placed in your cart!');
                        console.log('Shopping Cart: \n' + itemName + '(' + newItemNum + ') x ' + '$' + price);
                        console.log('Your total: \$' + totalPrice);

                        connection.query('UPDATE departments SET ProductSales = ProductSales + ' + totalPrice + ' WHERE DepartmentName = "Books"', function(err,res){
                            if(err){
                                console.log(err);
                                return;
                            }
                           
                        });
                    });
               });

            });

        });
        });
};