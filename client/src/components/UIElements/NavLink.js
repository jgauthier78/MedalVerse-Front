import { Link } from 'react-scroll'

const NavLink = ({ label, linkTo }) =>
    (<span role="button" className="text-light text-center nav-link"><Link to={linkTo} spy={true} smooth={false}>{label}</Link></span>)

export default NavLink