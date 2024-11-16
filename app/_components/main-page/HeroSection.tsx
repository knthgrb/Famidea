import Image from "next/image";
import React from "react";

export default function HeroSection() {
  return (
    <section
      id="home"
      className="h-[90vh] bg-white flex justify-center items-stretch"
    >
      <div className="mx-auto max-w-screen-xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-20 ">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16 h-full">
          <div className="relative h-64 overflow-hidden rounded-lg sm:h-92 lg:order-last lg:h-full">
            <Image
              alt="Login Image"
              src="/images/login_image.png"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>

          <div className="lg:py-24">
            <h2 className="text-3xl font-bold sm:text-4xl text-gray-700 text-center lg:text-left">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur,
              earum.
            </h2>

            <p className="mt-4 text-gray-600 text-center lg:text-left">
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Aut qui
              hic atque tenetur quis eius quos ea neque sunt, accusantium soluta
              minus veniam tempora deserunt? Molestiae eius quidem quam
              repellat.
            </p>
            <p className="text-center lg:text-left">
              <a
                href="/signup"
                className="mt-6 inline-block rounded bg-customAccentColor px-4 py-3 text-sm font-semibold text-white transition hover:bg-customAccentColor/80 focus:outline-none focus:ring focus:ring-yellow-400"
              >
                Get Started Today
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
