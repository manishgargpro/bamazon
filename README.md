#Bamazon, by Manish

##Basic Functionality

1. First open up a command line and navigate to the same directory as the app using `cd [your_directory_path]/bamazon` and then run `npm install`.

2. Next simply start the application using `node bamazonCustomer.js`; the entire application is run through inquirer.

##Screenshots

* [Initial Screen](/bamazon_screenshots/initScreen.png)

###Buy Item
1. Choosing `Buy item` starts with a prompted list of [existing items and their IDs](/bamazon_screenshots/buyItem.png).
2. Next is a prompt for [how many the user wants](/bamazon_screenshots/buyQuantity.png).
3. If there is enough product to meet the desired quantity then [this appears.](/bamazon_screenshots/buySuccess.png) Whereas if there is not enough, [this appears](/bamazon_screenshots/buyNotEnough.png).

###Post Item
1. Choosing `Post item(s)` will ask the user to go through a bunch of different prompts, starting with a prompt for [admin login](/bamazon_screenshots/postLogin.png) (the password is set to "admin" for now).

2. Next is [item name](/bamazon_screenshots/postItemName.png), followed by [department](/bamazon_screenshots/postItemDepartment.png), [price](/bamazon_screenshots/postItemPrice.png), and [quantity](/bamazon_screenshots/postItemQuantity.png).

3. After the prompts, if there are no errors, [this appears](/bamazon_screenshots/postItemSuccess.png).

###View Items

1. Choosing `View all items` is pretty straight forward, it prompts the user for an admin login (the same password as `Post item(s)`) and yields [this result](/bamazon_screenshots/viewItemsSuccess.png).

###View Profits

1. Choosing `View department profits` is also pretty straight forward, same as `View all items` except that their is one more prompt for [choosing the department](/bamazon_screenshots/viewProfitsDepartment.png).

2. [This is the result](/bamazon_screenshots/viewProfitsSuccess.png)