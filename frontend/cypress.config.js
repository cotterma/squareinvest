const { defineConfig } = require("cypress");
const oracledb = require("oracledb");
require("mandatoryenv").load(["ORACLE_PASSWORD", "WALLET_PASSWORD"]);
const {ORACLE_PASSWORD, WALLET_PASSWORD} = process.env;

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      on('task', {
        queryDatabase: (query) => {
          const dbOptions = {
            username: "ADMIN",
            password: ORACLE_PASSWORD,
            connectString:
              "(description= (retry_count=20)(retry_delay=3)(address=(protocol=tcps)(port=1522)(host=adb.eu-paris-1.oraclecloud.com))(connect_data=(service_name=gacec186cce94f5_squareinvestdb_high.adb.oraclecloud.com))(security=(ssl_server_dn_match=yes)))",
            walletLocation: "../Wallet_squareinvestDB",
            walletPassword: WALLET_PASSWORD,
          };
          return new Promise((resolve, reject) => {
            oracledb.getConnection(dbOptions, (err, connection) => {
              if (err) {
                reject(err);
                return;
              }
    
              connection.execute(query, (err, result) => {
                if (err) {
                  reject(err);
                  return;
                }
    
                connection.close((err) => {
                  if (err) {
                    reject(err);
                    return;
                  }
    
                  resolve(result.rows);
                });
              });
            });
          });
        }
      });
    },
  },
});
