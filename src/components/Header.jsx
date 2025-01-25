import { IconButton } from './Icons';
import PersonPhoto from './PersonPhoto';
import { routes } from '@/app/resources/config';

export default function Header() {
    return (
        <div className='top-0 w-full py-8'>
            <div className="flex md:justify-between justify-around h-12 mx-auto lg:px-8 container">

                <PersonPhoto imgSrc = "/assets/logo.jpg" height="10" width="10"/>
                <div className="flex flex-row justify-around w-auto h-auto border rounded-full py-1 px-1 items-center self-center">
                    {routes["/"] && <IconButton iconName="home" href="/" />}
                    {routes["/blog"] && <IconButton iconName="book" text="Blog" href="/blog" />}
                    {routes["/work"] && <IconButton iconName="briefcase" text="Work" href="/work" />}
                    {routes["/about"] && <IconButton iconName="person" text="About" href="/about" />}
                </div>
                <PersonPhoto imgSrc = "/assets/Arfi_Photo.png" height="10" width="10" styles={{"visibility": "hidden"}}/>

            </div>
        </div>
    );
};
