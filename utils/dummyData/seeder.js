import fs from "fs";
import "colors";
import dotenv from "dotenv";
import {Product} from "../../models/Product.js";
import {db_connection} from "../../config/database.js";

dotenv.config({path: "../../config.env"});

// connect to DB
db_connection();

// Read data
const products = JSON.parse(fs.readFileSync("./products.json"));

// Insert data into DB
const insertData = async () => {
    try {
        await Product.create(products);
        console.log("Data Inserted".green.inverse);
        process.exit();
    } catch (error) {
        console.log(error);
    }
};

// Delete data from DB
const destroyData = async () => {
    try {
        await Product.deleteMany();
        console.log("Data Destroyed".red.inverse);
        process.exit();
    } catch (error) {
        console.log(error);
    }
};

// node seeder.js -d
if (process.argv[2] === "-i") {
    insertData();
} else if (process.argv[2] === "-d") {
    destroyData();
}
