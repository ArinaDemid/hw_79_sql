const path = require("path");

const rootPath = __dirname;

module.exports = {
  rootPath,
  uploadPath: path.join(rootPath, "public/uploads"),
  database: {
    host     : 'localhost',
    user     : 'user',
    password : '1qaz@WSX29',
    database : '79_hw'
  }
};