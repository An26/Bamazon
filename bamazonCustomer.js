var inquirer = require('inquirer');
var mysql = ('mysql');
var color = require('color');
var cliTable = require('cli-table');
var mysql = require('mysql');
var connection = mysql.createConnection({
	host: 'localhost',
	port: 3306,
	user: 'root',
	password: 'teecup26',
	database: 'bamazon_db',
});
	connection.connect(function(err){
		if (err) throw err;
		console.log('connected as id' + connection.threadId);
	});


//sudo coding

//display current items for sale - all of its details in a table
// prompt user for the id of the item they would like to purchase
// then ask how many of these items they would like to purchase
	//---validate to make sure items wanting to purchased is sufficient values
//4.If sufficient, update database, and tell customer how much their total is
	//add taxes??? :D

//showCurrentListings(); //how to show data and then have a prompt...
forCustomer();


// function showCurrentListings() {
// 	console.log('current listings:');
	
// 		if(err) {
// 			console.log(err);
// 		}
// 		console.log(res);
// 	});
// 	connection.end();
// };



function forCustomer() {
	connection.query('SELECT * FROM products', function(err, res) {
		console.log(res);
		inquirer.prompt({
			type:'input',
			name: 'id',
			message: 'What would you like to purchase? \nPlease provide the ID number of the item you would like to purchase...'
			// validate: function(){
			// 	if(type.input = true)
			// 	console.log('check if it\'s a viable number from the list of items);
			// 		return true;
			// }

		}).then(function(res){
				
			//find item that corresponds with the ID number
				connection.query('SELECT * FROM products WHERE ID =' + res.id, function(err, response) {
					if(err) {
						console.log(err);
					}
					//console.log(response);
					var numInStock = response[0].StockQuantity;
					console.log('your choice: ' + response[0].ProductName);
				});

				//console.log(numInStock);

				//connection.end();
				inquirer.prompt([{
					name: 'num',
					type: 'input',
					message: 'How many items of this selection would you like?',
					validate: function(value) {
			            if (isNaN(value) == false) {
			                return true;
			            } else {
			                return false;
			            }
			        }
				}]).then(function(number) {
					console.log('id: ' + res.id);
					console.log('number of purchases: ' + number.num);

					//finding current in stock values
					var numInStock = res;
					console.log(res);

					// connection.query('SELECT StockQuantity FROM products WHERE ID = ' + res.id, function(err, data) {
					// 	if(err){
					// 		console.log(err);
					// 	} 
					// 	//console.log(data[0].StockQuantity); 
					// 	var numInStock = data[0].StockQuantity;

					// });

					// console.log("left in stock: " + numInStock);

					//console.log(numInStock);
					//console.log(numInStock[1]);
					//if(number.num < (find value by pulling it from database!))


					// connection.query('UPDATE products SET StockQuantity = StockQuantity -' + number.num + ' WHERE ID = ' + res.id, function(err, res){
					// 		if(err){
					// 			console.log('no changes where made');
					// 			console.log(err);
					// 		} else {
					// 			console.log('changes were made!');	
					// 		}
					// })
				})
		});
	});
};




