import { Container } from "react-bootstrap";


const NavBarSpacer = () => {
    return (
        <div className="NavBar-Spacer" />
    )
}

const Spacer = ({size}) => {
    if (size>=0 && size <= 5)
    {
        return (
            <Container className={`mt-${size}`}/>
        )
    }
    else
        return (
            <Container className="mt-auto"/>
        )
}

export { NavBarSpacer, Spacer }