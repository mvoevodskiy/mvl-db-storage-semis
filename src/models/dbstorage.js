module.exports = (Sequelize) => {
  return [
    {
      key: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false
      },
      value: {
        type: Sequelize.TEXT('long'),
        get () {
          const json = this.getDataValue('value')
          let value = {}
          try {
            value = JSON.parse(json)
          } catch (e) {
            console.error('ERROR JSON PARSING FROM DB STORAGE', e)
          }
          return value
        },
        set (value) {
          let json
          try {
            json = JSON.stringify(value)
          } catch (e) {
            console.error('ERROR STRINGIFY VALUE TO DB STORAGE:', value)
            json = '{}'
          }
          // 'this' allows you to access attributes of the instance
          this.setDataValue('value', json)
        },
      },
    },
    // Model options
    {},
    // Model associations
    {}
  ]
}
