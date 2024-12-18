'use client';

import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faInstagram, faYoutube} from '@fortawesome/free-brands-svg-icons';
import {NavigationItem} from "@/types/footer/types";
import moment from "moment";
import Link from "next/link";

const navigation: NavigationItem[] = [
    {
        name: 'Instagram',
        href: 'https://www.instagram.com', // Replace '#' with actual URL
        icon: faInstagram,
    },
    {
        name: 'YouTube',
        href: 'https://www.youtube.com', // Replace '#' with actual URL
        icon: faYoutube,
    },
];

const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-200">
            <div className="mx-auto max-w-8xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
                <div className="flex justify-center gap-x-6 md:order-2">
                    {navigation.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className="text-gray-400 hover:text-gray-300"
                            aria-label={item.name}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <FontAwesomeIcon
                                icon={item.icon}
                                aria-hidden="true"
                                className="h-6 w-6 text-gray-500 hover:text-gray-300 transition-colors duration-200"
                            />
                        </Link>
                    ))}
                </div>

                {/* Footer Text */}
                <p className="mt-8 text-center text-sm text-gray-400 md:order-1 md:mt-0">
                    &copy; {moment().format('YYYY')} Yin Company, Inc. All rights reserved.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
