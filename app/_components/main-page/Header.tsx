"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";

export default function Header() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header className="bg-white border-b">
      <div className="h-[10vh] mx-auto flex max-w-screen-xl items-center gap-8 px-4 sm:px-6 lg:px-8">
        <Image
          src="/images/blue_logo.png"
          alt="logo"
          width={100}
          height={100}
          priority={true}
          quality={80}
        />

        <div className="flex flex-1 items-center justify-end">
          <div className="flex items-center justify-center gap-8">
            <nav aria-label="Global" className="hidden md:block">
              <ul className="flex items-center gap-6 text-sm">
                <li>
                  <a
                    className="text-gray-500 transition hover:text-customAccentColor font-semibold"
                    href="#about"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    className="text-gray-500 transition hover:text-customAccentColor font-semibold"
                    href="/login"
                  >
                    Login
                  </a>
                </li>
              </ul>
            </nav>
            <div className="md:flex md:gap-4 hidden">
              <a
                className="rounded-md bg-customAccentColor px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-customAccentColor/75"
                href="/login"
              >
                Get Started
              </a>
            </div>

            <button
              onClick={() => setOpen(!open)}
              className="block rounded bg-gray-100 p-2.5 text-gray-600 transition hover:text-gray-600/75 md:hidden"
            >
              <span className="sr-only">Toggle menu</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile sliding menu */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white p-4 shadow-lg transform ${
          open ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out`}
      >
        <button
          onClick={() => setOpen(false)}
          className="absolute top-4 right-4 text-gray-600"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <nav aria-label="Mobile" className="mt-8">
          <ul className="flex flex-col gap-4 text-sm">
            <li>
              <a
                className="text-gray-500 transition hover:text-customAccentColor font-semibold"
                href="#about"
              >
                About
              </a>
            </li>
            <li>
              <a
                className="text-gray-500 transition hover:text-customAccentColor font-semibold"
                href="/login"
              >
                Login
              </a>
            </li>
            <div className="border-[0.5px] border-gray-200"></div>
            <div className="flex flex-col gap-2">
              <a
                className="w-full rounded-md bg-customAccentColor px-4 py-3 text-sm font-medium text-white transition hover:bg-customAccentColor/75"
                href="/login"
              >
                Get Started
              </a>
            </div>
          </ul>
        </nav>
      </div>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black opacity-50 md:hidden"
          onClick={() => setOpen(false)}
        ></div>
      )}
    </header>
  );
}
