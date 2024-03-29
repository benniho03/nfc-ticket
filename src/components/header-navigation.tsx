import { SignIn, SignInButton, SignOutButton, useAuth } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

function HeaderNavigation({ mainSite }: { mainSite?: boolean }) {
  const [navbar, setNavbar] = useState(false);
  const { isSignedIn } = useAuth();
  return (
    <div>
      <nav className={`${mainSite ? "fixed" : ""} w-full bg-transparent top-0 left-0 right-0 z-10 mb-4`}>
        <div className="justify-between px-4 mx-auto lg:max-w-7xl md:items-center md:flex md:px-8">
          <div>
            <div className="flex items-center justify-between py-3 md:py-5 md:block">
              <Link href="/">
                <Image src="/logo.png" width={180} height={180} alt="logo" />
              </Link>
              <div className="md:hidden">
                <button
                  className="p-2 text-gray-700 rounded-md outline-none focus:border-gray-400 focus:border"
                  onClick={() => setNavbar(!navbar)}
                >
                  {navbar ? (
                    <Image src="/close.svg" width={30} height={30} alt="logo" />
                  ) : (
                    <Image
                      src="/hamburger-menu.svg"
                      width={30}
                      height={30}
                      alt="logo"
                      className="focus:border-none active:border-none"
                    />
                  )}
                </button>
              </div>
            </div>
          </div>
          <div>
            <div
              className={`flex-1 justify-self-center pb-3 mt-8 md:block md:pb-0 md:mt-0 ${navbar ? 'p-12 md:p-0 block' : 'hidden'
                }`}
            >
              <ul className="h-screen text-2xl text-white md:h-auto items-center justify-center md:flex font-semibold md:items-end md:gap-8">
                <li className="text-center border-b-2 md:border-b-0  hover:bg-pink-700  border-pink-700  md:hover:text-pink-700 md:hover:bg-transparent">
                  <Link href="/admin" onClick={() => setNavbar(!navbar)}>
                    Verwaltung
                  </Link>
                </li>
                <li className="text-center border-b-2 md:border-b-0 hover:text-pink-700 md:hover:bg-transparent">
                  <Link href="/event" onClick={() => setNavbar(!navbar)}>
                    Events
                  </Link>
                </li>
                <li className="text-center border-b-2 md:border-b-0 hover:text-pink-700 md:hover:bg-transparent">
                  {isSignedIn ?
                    <SignOutButton>
                      Ausloggen
                    </SignOutButton> :
                    <SignInButton>
                      Einloggen
                    </SignInButton>
                  }
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default HeaderNavigation;