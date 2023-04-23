import { DataTypes } from "sequelize";

export default (sequelize) => {
    const columns = {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        certificate: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        expirationDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    };

    const timeConfig = {
        timestamps: true,
    };

    return sequelize.define("Inspection", columns, timeConfig);
};
