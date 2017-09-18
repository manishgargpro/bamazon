var mysql = require('mysql');

var inquirer = require('inquirer');

var fs = require('fs');

var password = 'admin';

var connection = mysql.createConnection({
  host: '127.0.0.1',
  port: 3306,
  user: 'root',
  password: 'root',
  database: 'bamazon_db'
});

var userOptions = function() {
  inquirer.prompt([{
    type: 'list',
    message: 'Do you want to: ',
    choices: ['Buy an item', 'Post item(s)', 'View all items', 'View department profits'],
    name: 'action'

  }]).then(function(answer) {
    if (answer.action === 'Post item(s)') {
      inquirer.prompt([{
        type: 'password',
        message: 'Enter admin password',
        name: 'password'
      }]).then(function(answer) {
        if (answer.password === password) {
          inquirer.prompt([{
              type: 'input',
              message: 'Enter item name',
              name: 'itemName'
            },
            {
              type: 'input',
              message: 'Enter item department name',
              name: 'departmentName'
            },
            {
              type: 'input',
              message: 'Enter price',
              name: 'price'
            },
            {
              type: 'input',
              message: 'How many?',
              name: 'quantity'
            }
          ]).then(function(answer) {
            addItem(answer.itemName, answer.departmentName, answer.price, answer.quantity)
          });
        } else {
          console.log('Incorrect password')
        }
      })
    } else if (answer.action === 'Buy an item') {
      listItems();
    } else if (answer.action === 'View all items') {
      inquirer.prompt([{
        type: 'password',
        message: 'Enter admin password',
        name: 'password'
      }]).then(function(answer) {
        if (answer.password === password) {
          connection.query('SELECT * FROM products', function(error, result) {
            for (var i = 0; i < result.length; i++) {
              console.log(result[i].item_id + '. ' + result[i].product_name + ' (' + result[i].department_name + ', ' + result[i].stock_quantity + ' units remaining, ' + result[i].price + 'per unit)');
            }
            connection.end();
          })
        } else {
          console.log('Incorrect password')
        }
      })
    } else if (answer.action === 'View department profits') {
      inquirer.prompt([{
        type: 'password',
        message: 'Enter admin password',
        name: 'password'
      }]).then(function(answer) {
        if (answer.password === password) {
          viewProfits();
        } else {
          console.log('Incorrect password')
        }
      });
    }
  })
}

function addItem(item, cat, price, quant) {
  connection.query('SELECT * FROM products WHERE product_name = ? AND department_name = ? AND price = ?', [item.toLowerCase(), cat.toLowerCase(), price], function(error, result) {
    if (error) { console.log(error) }
    if (result.length == 0) {
      connection.query('INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES (?, ?, ?, ?)', [item.toLowerCase(), cat.toLowerCase(), parseInt(price), parseInt(quant)], function(error) {
        if (error) throw error;
        console.log('Item successfully added');
        connection.end();
      })
    } else {
      connection.query('UPDATE products SET stock_quantity = ? WHERE product_name = ? AND department_name = ? AND price = ?', [parseInt(quant), item.toLowerCase(), cat.toLowerCase(), parseInt(price)], function(error) {
        if (error) throw error;
        console.log('Item successfully added');
        connection.end();
      })
    }
  })
}

function viewProfits() {
  connection.query('SELECT department_name FROM departments', function(error, result) {
    if (error) { console.log(error) }
    inquirer.prompt([{
      type: 'list',
      message: 'Choose a department',
      name: 'department',
      choices: createDeps(result)
    }]).then(function(answer) {
      connection.query('SELECT over_head_costs FROM departments where department_name = ?', [answer.department], function(error, result) {
        var costs = parseInt(result[0].over_head_costs);
        connection.query('SELECT SUM(total_sales) as department_sales from products WHERE department_name = ?', answer.department, function(error, result) {
          var sales = result[0].department_sales;
          var profits = sales - costs;
          console.log('Total profits for selected department: ' + profits);
          connection.end();
        })
      });
    });
  });
}

function createList(result) {
  var resArr = [];
  for (var i = 0; i < result.length; i++) {
    var res = 'Item: ' + result[i].product_name + ' | ID: ' + result[i].item_id;
    resArr.push(res);
  }
  return resArr;
}

function createDeps(result) {
  var resArr = [];
  for (var i = 0; i < result.length; i++) {
    var res = result[i].department_name
    resArr.push(res);
  }
  return resArr;
}

function listItems() {
  connection.query('SELECT product_name, item_id FROM products', function(error, result) {
    if (error) { console.log(error) }
    //console.log(result);
    inquirer.prompt([{
        type: 'list',
        message: 'Choose an item',
        name: 'items',
        choices: createList(result)
      },
      {
        type: 'input',
        message: 'How many would you like?',
        name: 'quantity'
      }
    ]).then(function(answer) {
      var itemArr = answer.items.split(" ");
      var itemID = itemArr[itemArr.length - 1];
      var needQuant = parseInt(answer.quantity);
      buyItem(itemID, needQuant);
    })
  })
}

function buyItem(id, quant) {
  connection.query('SELECT price, stock_quantity FROM products WHERE item_id = ?', id, function(error, result) {
    if (error) { console.log(error) };
    var itemPrice = result[0].price;
    var totalPrice = itemPrice * quant;
    if (result[0].stock_quantity >= quant) {
      connection.query('UPDATE products SET stock_quantity = stock_quantity - ? WHERE item_id = ?', [quant, id], function(error) {
        if (error) { console.log(error) } else { console.log("Purchase successful! Your total price is " + totalPrice) }
      })
      connection.query('UPDATE products SET total_sales = total_sales + ? WHERE item_id = ?', [totalPrice, id], function(error, result) {
        if (error) { console.log(error) }
      })
    } else {
      console.log("We don't have enough product")
    }
    connection.end();
  })
}

userOptions();