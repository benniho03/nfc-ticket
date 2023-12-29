import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

function Footer(){
    return(
        <footer className="bg-slate-950 text-white py-4 px-3 mt-16">
    <div className=" mx-auto flex flex-wrap items-center justify-end">
        <div className="w-full md:w-1/2 md:text-center md:mb-0 mb-8 justify-end">
            <ul className="list-reset flex justify-end flex-wrap text-xs md:text-sm gap-3">
                <li><a href="#" className=" hover:text-pink-700">Datenschutz</a></li>
                <li className="mx-10"><a href="#" className="text-slate-50 hover:text-pink-700">Impressum</a></li>
            </ul>
        </div>
    </div>
</footer>
    )
}
export default Footer;