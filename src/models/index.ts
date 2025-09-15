import sequelize from "../config/database.js";
import User from "./User.js";

const models = {
  User,
};

export { sequelize };
export default models;
