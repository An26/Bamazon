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
		//console.log('connected as id' + connection.threadId);
});

bamExecutive();

function bamExecutive() {
	inquirer.prompt([{
		type: 'list',
		name: 'option',
		message: 'Please choose from the following executive choices: ',
		choices: ['View Product Sales by Department', 'Create New Department']
	}]).then(function(data){
			if(data.option === "View Product Sales by Department"){
				connection.query('SELECT * FROM departments', function(err, res){
					if(err){
						console.log(err);
					}
				//console.log(res);

				var table = new Table({
					head: ['ID', 'Department', 'Overhead Costs', 'Total Sales'],
					colWidths: [6, 25, 20, 15]
				});

				for (var i = 0; i < res.length; i++){
					table.push([res[i].DepartmentID, res[i].DepartmentName, '$' + res[i].OverHeadCosts, '$' + res[i].TotalSales]);
				}

				console.log(table.toString());


				connection.end();
				})

			}else if(data.option === 'Create New Department') {
				inquirer.prompt([{
					type: 'input',
					name: 'departmentName',
					message: 'What is the name of the new department you would like to add?'

				},{
					type: 'input',
					name: 'overHeadCost',
					message: 'What is the begining overhead cost? $'
				}]).then(function(res){
					var newNum = res.overHeadCost;
					newNum = newNum.split(',').join('');

					connection.query('INSERT INTO departments(DepartmentName, OverHeadCosts) VALUE ("' + res.departmentName + '", ' + newNum + ')', function(err,response) {
						if(err) {
							console.log(err);
						} else{
						console.log(res.departmentName + ' department has been successfully added.');
						}
					connection.end();
					})
				})
			}
	});
}