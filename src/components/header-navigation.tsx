import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

function NavBar() {
  const [navbar, setNavbar] = useState(false);
  return (
    <div>
      <nav className="w-full bg-transparent fixed top-0 left-0 right-0 z-10 mb-4 ">
        <div className="justify-between px-4 mx-auto lg:max-w-7xl md:items-center md:flex md:px-8">
          <div>
            <div className="flex items-center justify-between py-3 md:py-5 md:block">

              <Link href="/">
                <h2 className="text-2xl text-cyan-600 font-bold ">LOGO</h2>
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
              className={`flex-1 justify-self-center pb-3 mt-8 md:block md:pb-0 md:mt-0 ${
                navbar ? 'p-12 md:p-0 block' : 'hidden'
              }`}
            >
              <ul className="h-screen md:h-auto items-center justify-center md:flex font-semibold ">
                <li className=" text-2xl text-white py-2 md:px-6 text-center border-b-2 md:border-b-0  hover:bg-pink-700  border-pink-700  md:hover:text-pink-700 md:hover:bg-transparent">
                  <Link href="/admin" onClick={() => setNavbar(!navbar)}>
                    Admin
                  </Link>
                </li>
                <li className=" text-2xl text-white py-2 px-6 text-center  border-b-2 md:border-b-0  hover:bg-pink-700  border-pink-700  md:hover:text-pink-700 md:hover:bg-transparent">
                  <Link href="/event" onClick={() => setNavbar(!navbar)}>
                    Events
                  </Link>
                </li>
                <li className=" text-2xl text-white py-2 text-center  border-b-2 md:border-b-0  hover:bg-pink-700 border-pink-700  md:hover:text-pink-700 md:hover:bg-transparent">
                  <Link href="/event/create" onClick={() => setNavbar(!navbar)}>
                    Event erstellen
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default NavBar;