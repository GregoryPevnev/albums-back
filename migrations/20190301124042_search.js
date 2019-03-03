const fs = require("fs");
const path = require("path");

const SQL_PATH = String(process.env.SQL_PATH);

exports.up = function(knex, Promise) {
    const sql = fs.readFileSync(path.join(SQL_PATH, "searchInit.pgsql"), "utf8");
    return knex.raw(sql);
};

exports.down = function(knex, Promise) {
    const sql = fs.readFileSync(path.join(SQL_PATH, "searchDrop.pgsql"), "utf8");
    return knex.raw(sql);
};
