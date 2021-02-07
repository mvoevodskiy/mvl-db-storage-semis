const { MVLoaderBase } = require('mvloader')
const Store = require('./store')
const fs = require('fs')

class mvlDBStorageSemis extends MVLoaderBase {
  constructor (App, ...config) {
    const localDefaults = {
      fileStoragePrefixes: {
        'sessions.json': 'ses:',
        'storage.json': 'store:'
      }
    }
    super(localDefaults, ...config)
    this.App = App
  }

  async init () {
    return super.init()
  }

  async initFinish () {
    await super.initFinish()
    await this.migrateStorageToDB()
  }

  async migrateStorageToDB () {
    if (!(await this.App.DB.models.mvlDBStorage.count())) {
      const promises = []
      for (let filename in this.config.fileStoragePrefixes) {
        if (Object.prototype.hasOwnProperty.call(this.config.fileStoragePrefixes, filename)) {
          // console.log('FILENAME', filename)
          try {
            if (!fs.existsSync(filename)) continue
            const storage = JSON.parse(fs.readFileSync(filename))
            for (let key in storage) {
              if (Object.prototype.hasOwnProperty.call(storage, key)) {
                promises.push(
                  (() => this.App.DB.models.mvlDBStorage.create({
                    key: this.config.fileStoragePrefixes[filename] + key,
                    value: storage[key]
                  }))()
                )
              }
            }
          } catch (e) {
            console.log(e)
          }
        }
      }
      return Promise.all(promises)
    }}
}

mvlDBStorageSemis.exportConfig = {
  ext: {
    classes: {
      semis: {},
      controllers: {},
      handlers: {}
    },
    configs: {
      controllers: {},
      handlers: {
        BotHandler: {
          botcms: {
            Context: {
              session: {
                adapter: 'bot-db-storage',
                store: Store,
                prefix: 'ses:'
              }
            },
            StorageManager: {
              adapter: 'bot-db-storage',
              store: Store,
              prefix: 'store:'
            }
          }
        },
        DBHandler: {
          sequelize: {},
          models: {
            mvlDBStorage: require('./models/dbstorage')
          }
        }
      },
      semis: {}
    }
  },
  db: {}
}

module.exports = mvlDBStorageSemis
