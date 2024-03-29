// Load Enviroment Variables to process.env (if not present take variables defined in .env file)
require("mandatoryenv").load(["ORACLE_PASSWORD", "WALLET_PASSWORD"]);
const { ORACLE_PASSWORD, WALLET_PASSWORD } = process.env;

const connectionConfig = {
  dialect: "oracle",
  username: "ADMIN",
  password: ORACLE_PASSWORD,
  dialectOptions: {
    connectString:
      "(description= (retry_count=20)(retry_delay=3)(address=(protocol=tcps)(port=1522)(host=adb.eu-paris-1.oraclecloud.com))(connect_data=(service_name=gacec186cce94f5_squareinvestdb_high.adb.oraclecloud.com))(security=(ssl_server_dn_match=yes)))",
    walletLocation: "./Wallet_squareinvestDB",
    walletPassword: WALLET_PASSWORD,
  },
};

const Sequelize = require("sequelize");
const db = new Sequelize(connectionConfig);

db.authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((error) => {
    console.error("Unable to connect to the database:", error);
  });
// const db = new Sequelize(DB)
module.exports = db;
