module.exports = (sequelize, DataTypes) => {
  const Profile = sequelize.define('Profile', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userName: DataTypes.STRING,
    password: DataTypes.STRING,
    role: {
      type: DataTypes.STRING,
      defaultValue: 'user',
    },
  },
  {
    tableName: 'Profiles',
    underscored: true,
  });

  Profile.associate = (models) => {
    Profile.hasOne(models.User, {
      foreignKey: 'profile_id',
      as: 'profile',
    });
  }

  return Profile;
};
