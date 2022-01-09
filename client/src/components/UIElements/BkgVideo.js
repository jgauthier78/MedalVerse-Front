
import React from 'react';

const BkgVideo = ({ videoSource, children, blur, options }) => {
    return (
        <>
            <div>
                <video
                    style={{ filter: `blur(${blur}px)`, WebkitFilter: `blur(${blur}px)` }}
                    autoPlay="autoplay"
                    playsInline="playsinline"
                    loop="loop"
                    muted
                    id="video-id"
                    className={` ${options}`} >
                    {/* TODO make it accept multiple media types */}
                    <source src={videoSource} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
                {children}
            </div>

        </>
    )
}

export default BkgVideo