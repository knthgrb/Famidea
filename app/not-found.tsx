import React from "react";
import Link from "next/link";

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white">
      <h1 className="text-5xl font-bold text-gray-800">404</h1>
      <p className="mt-4 text-xl text-gray-600">Oops! Page not found.</p>
      <p className="mt-2 text-gray-500">
        The page you are looking for does not exist.
      </p>
      <Link
        href="/"
        className="mt-6 bg-customAccentColor text-white rounded-md px-4 py-2"
      >
        Go to Home
      </Link>
    </div>
  );
};

export default NotFoundPage;
