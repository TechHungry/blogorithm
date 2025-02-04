import Link from 'next/link';

import {
    HiChevronUp,
    HiChevronDown,
    HiChevronRight,
    HiChevronLeft,
    HiArrowUpRight,
    HiOutlineArrowPath,
    HiCheck,
    HiMiniQuestionMarkCircle,
    HiMiniXMark,
    HiOutlineLink,
    HiExclamationTriangle,
    HiInformationCircle,
    HiExclamationCircle,
    HiCheckCircle,
    HiMiniGlobeAsiaAustralia,
    HiArrowTopRightOnSquare,
    HiEnvelope,
    HiCalendarDays,
    HiClipboard,
    HiArrowRight,
} from "react-icons/hi2";

import { AiFillMail } from "react-icons/ai";
import { SlArrowDown } from "react-icons/sl";
import { GoArrowDown } from "react-icons/go";

import {
    PiHouseDuotone,
    PiUserCircleDuotone,
    PiGridFourDuotone,
    PiBookBookmarkDuotone,
    PiImageDuotone,
    PiBriefcaseDuotone
} from "react-icons/pi";

import { FaDiscord, FaGithub, FaLinkedin, FaXTwitter } from "react-icons/fa6";
import {IconType} from "react-icons";

interface IconLibrary {
    [key: string]: IconType;
}

export const iconLibrary: IconLibrary = {
    chevronUp: HiChevronUp,
    chevronDown: HiChevronDown,
    chevronRight: HiChevronRight,
    chevronLeft: HiChevronLeft,
    refresh: HiOutlineArrowPath,
    arrowUpRight: HiArrowUpRight,
    check: HiCheck,
    arrowRight: HiArrowRight,
    helpCircle: HiMiniQuestionMarkCircle,
    infoCircle: HiInformationCircle,
    warningTriangle: HiExclamationTriangle,
    errorCircle: HiExclamationCircle,
    checkCircle: HiCheckCircle,
    email: HiEnvelope,
    email2: AiFillMail,
    globe: HiMiniGlobeAsiaAustralia,
    person: PiUserCircleDuotone,
    grid: PiGridFourDuotone,
    book: PiBookBookmarkDuotone,
    close: HiMiniXMark,
    openLink: HiOutlineLink,
    calendar: HiCalendarDays,
    home: PiHouseDuotone,
    gallery: PiImageDuotone,
    discord: FaDiscord,
    github: FaGithub,
    linkedin: FaLinkedin,
    x: FaXTwitter,
    clipboard: HiClipboard,
    arrowUpRightFromSquare: HiArrowTopRightOnSquare,
    briefcase:PiBriefcaseDuotone,
    downArrow :GoArrowDown
};
interface IconButtonProps {
    iconName: keyof typeof iconLibrary;
    text?: string;
    href: string;
}

export function IconButton({ iconName, text, href }: IconButtonProps): any {
    const Icon = iconLibrary[iconName];
    
    return (
        <Link href={href} className={`flex icon-button items-center mx-2 h-7 hover:bg-white hover:text-black rounded-full`}>
            {iconName && <Icon className="md:w-10 h-5 w-5 md:ms-0 ms-2"/>}
            {text && <p className='px-2  mx-auto'>{text}</p>}
        </Link>
    );
}
