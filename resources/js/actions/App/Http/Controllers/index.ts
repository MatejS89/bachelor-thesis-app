import OsmDataController from './OsmDataController'
import Settings from './Settings'

const Controllers = {
    OsmDataController: Object.assign(OsmDataController, OsmDataController),
    Settings: Object.assign(Settings, Settings),
}

export default Controllers