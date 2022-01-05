

import Col from 'react-bootstrap/Col';
import NavEntry from '../../UIElements/NavEntry';


const SporstmanSideBar = ({ setPannel }) => (
    <Col className="col-auto col-md-3 col-xl-2 px-sm-2 px-0  verticalSeparator-left Side-Bar">
        <div className="d-flex flex-column align-items-center align-items-sm-start  pt-2 sidebarText min-vh-100">
            <NavEntry onClick={() => setPannel(0)} menuItem="Profil" />
            <NavEntry onClick={() => setPannel(1)} menuItem="Evénements" />
            <NavEntry onClick={() => setPannel(2)} menuItem="Gallerie" />

        </div>
    </Col>
)

export default SporstmanSideBar