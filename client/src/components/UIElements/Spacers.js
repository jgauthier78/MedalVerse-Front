const NavBarSpacer = () => {
    return (
        <div className="NavBar-Spacer" />
    )
}

const Spacer = ({size}) => {
    if (size===40)
    return (
        <div className="Spacer-40" />
    )
    else
    return (
        <div className="Spacer-20" />
    )
}

export { NavBarSpacer, Spacer }