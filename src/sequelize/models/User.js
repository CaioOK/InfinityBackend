module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: DataTypes.STRING,
    phone: DataTypes.STRING,
    email: DataTypes.STRING,
    cpf: DataTypes.STRING,
    password: DataTypes.STRING,
    perfil: DataTypes.STRING,
  },
  {
    timestamps: false,
    tableName: 'Users',
  });

  return User;
};
