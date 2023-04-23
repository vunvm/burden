function applyExtraSetup(sequelize) {
    const { User,  Car, Owner,Inspection } = sequelize.models;

    Owner.hasMany(Car);
    Car.belongsTo(Owner);

    Car.hasOne(Inspection);
    Inspection.belongsTo(Car);

    User.hasOne(Inspection);
    Inspection.belongsTo(User);
}

export default applyExtraSetup;
