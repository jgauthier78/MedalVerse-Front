import CacheImages from "./CacheImages";
import { Component } from "react";

class ImageContainer extends Component {
    state = {
        bkgImg: "",
    }


    changeBkg = () => {

        if (this.nextImage >= this.bkgImages.length) { this.nextImage = 0; }
        this.setState({ bkgImg: this.bkgImages[this.nextImage] })
        this.nextImage++

        setTimeout(this.changeBkg, 2000);

    }

    componentDidMount = () => {
        this.nextImage = 0
        // setTimeout(this.changeBkg, 2000);
    }

    constructor() {
        super()
        this.bkgImages = ["/img/bkg/Horsing.jpg", "/img/bkg/Lifting.jpg", "/img/bkg/Swimming2.jpeg", "/img/bkg/ball.jpg", "/img/bkg/pool.jpg", "/img/bkg/velo.jpg", "/img/bkg/skii.jpg"]
    }



    render() {
        return (
            <>
                <CacheImages Images={this.bkgImages} />
                <div id="bkgImage" className={`absolute t-0 Title-Image  bg-center Image-Container bkg-transition b-color ${this.props.options}`}
                    style={{ backgroundImage: `url(${this.state.bkgImg})` }}
                >

                    {this.props.children}

                    {/* L'image en fond */}

                    {/* On ajoute une couleur noire avec transparence pour opacifier le bkg */}

                </div>
            </>
        )
    }
}

// <span className="Image-Container-Darken" />

export default ImageContainer