const { MVLoaderBase } = require('mvloader')
// const DBHandler = require('mvl-db-handler');
// const ExampleSemis = require('./mvlblanksemis');

/**
 *
 * @class
 *
 * @property {Object.<import('mvl-db-handler').Sequelize>} DB
 * @property {Object.<import('mvtools')>} MT
 */

class Store extends MVLoaderBase {
  constructor (StorageManager, config) {
    const localConfig = {
      prefix: ''
    }
    super(localConfig, config)
    this.SM = StorageManager
    // console.log('STORE CONSTRUCTED. STORAGE MANAGER', StorageManager, 'CONFIG', this.config)
  }

  async init () {
    return super.init()
  }

  async initFinish () {
    super.initFinish()
  }

  async get (key) {
    key = this.config.prefix + key
    // console.log('STORE GET. KEY', key)
    const storageEntry = await this.SM.BC.DB.models.mvlDBStorage.findByPk(key)
    return storageEntry !== null ? storageEntry.value : {}
  }

  async set (key, value) {
    // console.log('STORE. SET KEY', key, 'VALUE KEYS', Object.keys(value))
    return await this.SM.BC.DB.models.mvlDBStorage.upsert({key: this.config.prefix + key, value})
      .catch(error => console.error('ERROR UPDATING STORAGE ', key, ':', error))
  }
}

module.exports = Store
