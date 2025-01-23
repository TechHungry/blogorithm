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

import {
    PiHouseDuotone,
    PiUserCircleDuotone,
    PiGridFourDuotone,
    PiBookBookmarkDuotone,
    PiImageDuotone,
    PiBriefcaseDuotone
} from "react-icons/pi";

import { FaDiscord, FaGithub, FaLinkedin, FaXTwitter } from "react-icons/fa6";

export const iconLibrary = {
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
    briefcase:PiBriefcaseDuotone
};

export function IconButton({ iconName, text, href }) {
    const Icon = iconLibrary[iconName];

    return (
        <Link href={href} className={`flex icon-button items-center mx-2 h-8 hover:border rounded-lg`}>
            <Icon className="w-10 h-5"/>
            {text && <p className='pe-2'>{text}</p>}
        </Link>
    );
}
