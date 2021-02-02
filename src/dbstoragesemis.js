const { MVLoaderBase } = require('mvloader')
const Store = require('./store')

class BotDBStorageSemis extends MVLoaderBase {
  constructor (App, ...config) {
    const localDefaults = {}
    super(localDefaults, ...config)
    this.App = App
  }

  async init () {
    return super.init()
  }

  async initFinish () {
    super.initFinish()
  }
}

BotDBStorageSemis.exportConfig = {
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

module.exports = BotDBStorageSemis
