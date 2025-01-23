export default function PersonPhoto({ imgSrc, height, width, styles }) {
    return (
        <div className="flex person-photo items-center">
            <img src={imgSrc} alt="Arfath Ahmed Syed" className={`rounded-full h-${height} w-${width}`} style={styles}/>
        </div>
    );
}
