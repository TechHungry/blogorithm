import Container from "@/components/container";
import { GITHUB_URL } from "@/lib/constants";
import {iconLibrary} from "@/components/Icons";

export function Footer() {
  const GithubIcon = iconLibrary["github"];
  return (
    <footer className="bg-black text-white py-8 text-center">
      <Container>
        <div className="py-8 flex flex-col lg:flex-row items-center">
          <h3 className="text-4xl lg:text-[2.5rem] font-bold tracking-tighter leading-tight text-center lg:text-left mb-5 md:mb-10 lg:mb-0 lg:pr-4 lg:w-1/2 font-satoshi ">
            Blogorithm.
          </h3>
          <div className="flex flex-col lg:flex-row justify-center items-center lg:pl-4 lg:w-1/2">
            <a
                href={GITHUB_URL}
                className="mx-3 bg-black hover:bg-white hover:text-black border border-black text-white font-bold py-3 px-12 lg:px-8 duration-200 transition-colors mb-6 lg:mb-0 flex items-center justify-center"
            >
              <span className={`pe-2`}><GithubIcon /></span>
              View on GitHub
            </a>
            <a
              href={GITHUB_URL}
              className="mx-3 font-bold hover:underline"
            >
              Reach Us
            </a>
          </div>
        </div>
        <hr className="border-gray-800 md:my-8 my-4" />
        <div className="text-gray-500 text-center text-sm">
          © 2025 Blogorithm. All rights reserved.
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
