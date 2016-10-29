var inquirer = require('inquirer');
var mysql = require('mysql');
var Table = require('cli-table');
var colors = require('colors');
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

bamManager();

function bamManager() {
	inquirer.prompt([{
		type: 'list',
		name: 'choice',
		message: 'Please choose from the following items: ',
		choices: ['View Products for Sale', 'View Low Inventory','Add to Inventory', 'Add New Product', 'Exit']
	}]).then(function(choice){
		//console.log(choice.choice);
		var expression = choice.choice;
		switch(expression) {
			case 'View Products for Sale':
				showProducts();
				break;
			case 'View Low Inventory':
				showLowInventory();
				break;
			case 'Add to Inventory':
				addInventory();
				break;
			case 'Add New Product':
				addProduct();
				break;
			case 'Exit':
				exit();
				break;
		};
	})
}

function showProducts() {
	connection.query('SELECT * FROM products', function(err, res) {
		if(err) {
			console.log(err);
			return false;
		} 
		
		var productTable = new Table({
				head: ['*ID*'.cyan, 'Product'.blue, 'Price'.blue, 'Department'.blue, 'In-Stock'.blue],
				colWidths: [6,50,10,25,10]
			});

		for (var i = 0; i < res.length; i++) {
			productTable.push([res[i].ID, res[i].ProductName, '$' + res[i].Price, res[i].DepartmentName, res[i].StockQuantity]);
		}

		console.log('\n' + productTable.toString());

		console.log('Press any arrow key to continue or Exit');
	});

	bamManager();
};

function showLowInventory() {
	connection.query('SELECT * FROM products WHERE StockQuantity < 5', function(err, res) {
		if(err) {
			console.log(err);
			return;
		} console.log(res);
		console.log('Press any arrow key to continue or Exit');
	});

	bamManager();	
}

function addInventory() {
	console.log("Items Currently Availible:");

	connection.query('SELECT ID, ProductName, StockQuantity FROM products', function(err, res) {
		if(err) {
			console.log(err);
			return;
		} console.log(res);
		//console.log(res[0].ProductName);

		inquirer.prompt([{
			type: 'input',
			name: 'IDNum',
			message: 'Please provide the ID number of the item you would like to add inventory towards',
			validate: function(value) {
		            if (isNaN(value) == false) {
		                return true;
		            } else {
		            	console.log('that is not a number');
		                return false;
		            }
	        	}
			}, 
			{
			type: 'input',
			name: 'addNum',
			message: 'How many items would you like to add?',
			validate: function(value) {
				var newNum = value;
					newNum = newNum.split(',').join('');

	            if (isNaN(newNum) == false) {
	                return true;
	            } else {
	            	console.log('that is not a number');
	                return false;
	            }
	        }
			}]).then(function(data) {
					var newAddNum = data.addNum;
					newAddNum = newAddNum.split(',').join('');

					console.log("id: " + data.IDNum);
					console.log("Num of items added: " + newAddNum);

					connection.query('UPDATE products SET StockQuantity = StockQuantity +' + newAddNum + ' WHERE ID = ' + data.IDNum, function(err, res) {
						if (err) {
							console.log('there was an error with that request');
							//incase user put in a decimal number
							console.log('Tip: You cannot add fractions of unit items.')
							return;
						} 
					});

					console.log(data.addNum + ' items was added to the inventory of \"' + res[data.IDNum - 1].ProductName + '\" stock');

					connection.query("SELECT ID, ProductName, StockQuantity FROM products WHERE ID = " + data.IDNum, function(err, res) {
						if (err) {
							console.log(err);
						}
						console.log(res);
						console.log('Press any arrow key to continue or Exit');
						bamManager();
					});
				});

	});


}

function addProduct() {
	inquirer.prompt([{
		type: 'input',
		name: 'productName',
		message: 'What is the product name?'
	},{
		type: 'input',
		name: 'departmentName',
		message: 'What department does this product fall under?'
	},{
		type: 'input',
		name: 'price',
		message: 'What is the unit price? $',
		validate: function(price) {
				//to count numbers with commas
				var newPrice = price;
					newPrice = newPrice.split(',').join('');
	            if (isNaN(newPrice) == false) {
	                return true;
		            } else {
		            	console.log('that is not a number');
		                return false;
		            }
	            }
	},{
		type: 'input',
		name: 'stockQuantity',
		message: 'How many items do you have of this product?',
		validate: function(value) {
			//console.log('validation is reached...')
				var newSQ = value;
					newSQ = newSQ.split(',').join('');
	            if (isNaN(newSQ) == false) {
	                return true;
		            } else {
		            	console.log('that is not a number');
		                return false;
		            }
		        }
	}]).then(function(data){
		var newPriceNum = data.price;
		newPriceNum = newPriceNum.split(',').join('');

		var newSQNum = data.stockQuantity;
		newSQNum = newSQNum.split(',').join('');

		connection.query('INSERT INTO products (ProductName, DepartmentName, Price, StockQuantity) VALUE ("' + data.productName + '", "' + data.departmentName + '", ' + newPriceNum + ', ' + newSQNum + ');');
		console.log(data.productName + ' was successfully added to your store!');
		connection.query('SELECT * FROM products', function(err, res){
			if (err){
				console.log(err);
			}
			console.log(res);
			console.log('press and arrow key to continue');
		});
		bamManager();
	});
}

function exit() {
	connection.end();
}