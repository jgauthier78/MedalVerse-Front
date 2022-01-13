import { Button } from 'react-bootstrap'
import { Link } from 'react-scroll'

const NavLink = ({ label, linkTo, white }) => {
    if (white)
        return (<Button className="text-light btn-landing" variant="outline-secondary"><Link to={linkTo} spy={true} smooth={false}>{label}</Link></Button>)

    return (<span role="button" className="text-light text-center nav-link"><Link to={linkTo} spy={true} smooth={false}>{label}</Link></span>)
}

export default NavLink