
const app = require("./app");
const config= require("./app/config");
const PORT = config.app.port;

const sequelize = require("../backend/app/utils/mysql")
// const sequelize = require('sequelize');


async function startServer(){
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
        } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

startServer();


app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}.`);
})

// npx sequelize-cli migration:generate --name migration-products-table
// npx sequelize-cli db:migrate