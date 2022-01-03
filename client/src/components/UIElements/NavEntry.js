

const NavEntry = ({ onClick, menuItem }) =>
(<a className="d-flex align-items-center pb-3 mb-md-0 me-md-auto text-white text-decoration-none " onClick={() => onClick()} >
    <span className="fs-5 d-none d-sm-inline mt-2 sidebarText">{menuItem}</span>
</a>)

export default NavEntry