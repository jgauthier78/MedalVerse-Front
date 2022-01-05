/**
 *
 * @module Components/UI/Img
 * @mixinSafe
 * @author PE CHAUT
 */


/**
 * Cache images to be loaded with the page, and not display them
 *
 * @param {*} Images  Array of images to cache
 */

function CacheImages(props) {



    return (

        <div>


            {
                props.Images.map((element, indx) => (
                    <img src={element} alt="" className="hiddenImage" key={indx} />
                ))
            }
        </div>

    )
}

export default CacheImages