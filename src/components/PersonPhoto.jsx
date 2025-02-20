export default function PersonPhoto({ imgSrc, height=9, width=9}) {
    return (
        <div className="flex person-photo items-center md:block my-4">
            <img src={imgSrc} alt="Arfath Ahmed Syed" className={`rounded-full max-h-10 max-w-10`} />
        </div>
    );
}
