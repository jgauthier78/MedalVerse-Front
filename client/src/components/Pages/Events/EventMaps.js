import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { format_Date } from "../../../utils/dateUtils";

const position = [48.9267091, 2.3557909]

const MarkerList = ({ userEvents }) => userEvents.eventList.map((ogdesc, indx) => {
    console.log(ogdesc.positionX)
    return (
        <Marker key={indx} position={[Number(ogdesc.positionX), Number(ogdesc.positionY)]}>
            <Popup>
                {ogdesc.eventDescription}
                <br />
                du {format_Date(ogdesc.startDate)} au {format_Date(ogdesc.endDate)}
            </Popup>
        </Marker >
    )
})

const EventMaps = ({ userProfile }) => (
    <div className="EventMap col mt-6">

        <MapContainer center={position} zoom={13} scrollWheelZoom={false}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MarkerList userEvents={userProfile.userEvents} />
        </MapContainer >
    </div>
)
export default EventMaps