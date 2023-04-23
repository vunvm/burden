import Sequelize from "sequelize";
import applyExtraSetup from "./associates.js";
import config from "../config/index.js";

import carModel from "./car.model.js";
import inspectionModel from "./inspection.model.js";
import userModel from "./user.model.js";
import ownerModel from "./owner.model.js";

const sequelize = new Sequelize(config.db_database, config.db_username, config.db_password, {
    host: config.db_host,
    port: config.db_port,
    dialect: config.db_dialect,
});

// models
const models = [carModel, inspectionModel, userModel, ownerModel];

for (const model of models) {
    model(sequelize);
}

// associates
applyExtraSetup(sequelize);

// sync
sequelize.sync({ alert: true }).then(() => {
    console.log("Sync successfully.");
});

export default sequelize;
