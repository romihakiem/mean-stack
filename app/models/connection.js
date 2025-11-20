const db = require("../configs/db");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(db.DATABASE, db.USERNAME, db.PASSWORD, {
    host: db.HOST,
    dialect: db.DIALECT,
    pool: {
        max: db.POOL.MAX,
        min: db.POOL.MIN,
        acquire: db.POOL.ACQUIRE,
        idle: db.POOL.IDLE,
    },
});

const connect = {};

connect.Sequelize = Sequelize;
connect.sequelize = sequelize;
connect.user = require("./user")(sequelize, Sequelize);
connect.role = require("./role")(sequelize, Sequelize);

connect.user.belongsToMany(connect.role, {
    through: "user_roles",
});

connect.ROLES = ["user", "admin", "moderator"];

module.exports = connect;
