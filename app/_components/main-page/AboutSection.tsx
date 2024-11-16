import React from "react";

export default function AboutSection() {
  return (
    <section
      id="about"
      className="bg-gray-100 py-4 h-auto lg:h-screen flex items-center"
    >
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8 justify-between">
          <div className="flex flex-1 items-center justify-center">
            <img
              alt="Birth center"
              src="images/about.png"
              className="rounded-lg h-72 lg:h-96 object-scale-down w-full"
            />
          </div>

          <div className="lg:py-4 flex-1">
            <h2 className="text-3xl font-bold sm:text-4xl text-gray-700 text-center lg:text-left">
              About FAMIDEA
            </h2>

            <p className="mt-4 text-gray-600 text-justify">
              FAMIDEA is a platform designed to bridge the gap between birth
              centers and patients, enabling seamless appointment booking,
              service discovery, and direct communication. By providing a mobile
              app for patients and a web system for birth centers, FAMIDEA
              ensures that everyone has the tools they need to connect
              effortlessly.
            </p>

            <h3 className="mt-8 text-xl text-gray-700 font-semibold text-center lg:text-left">
              Core Features & Objectives
            </h3>
            <ul className="mt-4 space-y-2 text-gray-600 list-disc list-inside text-justify">
              <li>
                A mobile app for patients and a web system for birth centers to
                address each user’s specific needs.
              </li>
              <li>
                Integrated recommender, scheduler, and filtering options to
                enhance user experience.
              </li>
              <li>Convenient QR scanner for easy tracking of appointments.</li>
              <li>
                Effortless appointment booking and comprehensive service
                listings.
              </li>
              <li>
                Notification and messaging system to keep patients and birth
                centers in touch.
              </li>
              <li>
                In-app push notifications and a chatbox for real-time
                communication.
              </li>
            </ul>
            <p className="text-center lg:text-left">
              <a
                href="#"
                className="mt-8 inline-block rounded bg-customAccentColor px-12 py-3 text-sm font-medium text-white transition hover:bg-customAccentColor/80 focus:outline-none focus:ring focus:ring-yellow-400"
              >
                Learn More
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
