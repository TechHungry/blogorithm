import { IconButton } from './Icons';

import CursorGradient from "@/components/CursorGradient";

interface Route {
    [key: string]: boolean;
}

interface NavbarProps {
    routes: Route;
}

export default function Navbar({ routes }: NavbarProps) {
    // make the navbar sticky

    return (
        <>
        <CursorGradient />
        <div className='top-0 w-full py-8 fixed z-50'>
            <div className="flex justify-around h-12 mx-auto lg:px-8 container align-middle">
                <div id="nav-grid" className="grid grid-cols-3 md:gap-16 items-center self-center bg-black border border-white rounded-full py-2 px-2 shadow-md">
                    {routes["/"] && <IconButton text="Home" href="/" iconName={''} />}
                    {routes["/blog"] && <IconButton text="Blogs" href="/blog" iconName={''} />}
                    {/*{routes["/work"] && <IconButton text="Projects" href="/work" iconName={''} />}*/}
                    {routes["/about"] && <IconButton text="About" href="/about" iconName={''} />}
                </div>
            </div>
        </div>
        </>
    );
};
