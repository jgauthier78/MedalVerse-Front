import { Link } from 'react-scroll'
const NavigateButton = ({ up, linkTo, white }) => {
    let classN = "scroll-up"
    if (up === "false") classN = "scroll-down"
    if (white === "true") classN += " scroll-white"
    return (
        <div className="row-sm">
            <Link to={linkTo} spy={true} smooth={false}>
                <p className={classN} address="true" />
            </Link>
        </div>
    )
}

export default NavigateButton