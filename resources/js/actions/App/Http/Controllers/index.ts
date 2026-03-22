import MapController from './MapController'
import Settings from './Settings'

const Controllers = {
    MapController: Object.assign(MapController, MapController),
    Settings: Object.assign(Settings, Settings),
}

export default Controllers