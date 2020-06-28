module.exports = (sequelize, DataTypes) => {
    const File = sequelize.define("file", {
      // id: {
      //   type: DataTypes.BIGINT,
      // },
      data: {
        type: DataTypes.BLOB("long"),
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: new Date()
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: new Date()
      }
    },{
      timestamps: false
    });
  
    return File;
  };