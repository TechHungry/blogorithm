import { IconButton } from './Icons';

interface Route {
    [key: string]: boolean;
}

interface NavbarProps {
    routes: Route;
}

export default function Navbar({ routes }: NavbarProps) {
    // make the navbar sticky

    return (
        <div className='top-0 w-full py-8 sticky z-50'>
            <div className="flex justify-around h-12 mx-auto lg:px-8 container align-middle">
                <div id="nav-grid" className="grid grid-cols-4 md:gap-16 items-center self-center bg-black border border-white rounded-full py-1 px-2 shadow-md">
                    {routes["/"] && <IconButton text="Home" href="/" iconName={''} />}
                    {routes["/blog"] && <IconButton text="Blog" href="/blog" iconName={''} />}
                    {routes["/work"] && <IconButton text="Works" href="/work" iconName={''} />}
                    {routes["/about"] && <IconButton text="About" href="/about" iconName={''} />}
                </div>
            </div>
        </div>
    );
};
