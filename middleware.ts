import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

// Define valid roles
type UserRole = "patients" | "birth_centers";

// Define the expected user structure
interface UserMetadata {
  role: UserRole;
}

interface User {
  user_metadata: UserMetadata;
}

// Define protected routes and their allowed roles
const PROTECTED_ROUTES: Record<string, UserRole[]> = {
  // Patient routes
  "/patient/dashboard": ["patients"],
  "/patient/appointments": ["patients"],
  // Birth center routes
  "/birth-center/dashboard": ["birth_centers"],
  "/birth-center/management": ["birth_centers"],
};

// Define public routes that don't need authentication
const PUBLIC_ROUTES = ["/", "/login", "/register"] as const;

export async function middleware(request: NextRequest) {
  // Update the auth session
  const response = await updateSession(request);

  // Get the current path
  const path = new URL(request.url).pathname;

  // Allow public routes to pass through
  if (PUBLIC_ROUTES.includes(path as (typeof PUBLIC_ROUTES)[number])) {
    return response;
  }

  try {
    // Get the user from the response headers set by updateSession
    const user = JSON.parse(
      response.headers.get("x-supabase-user") || "{}"
    ) as User;
    const role = user?.user_metadata?.role;

    // Check if the current path is protected
    const matchedRoute = Object.entries(PROTECTED_ROUTES).find(([route]) =>
      path.startsWith(route)
    );
    const requiredRoles = matchedRoute?.[1];

    // If the path is protected but user isn't logged in
    if (requiredRoles && !user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // If the path is protected and user doesn't have the required role
    if (requiredRoles && !requiredRoles.includes(role)) {
      // Redirect to appropriate dashboard based on role
      if (role === "patients") {
        return NextResponse.redirect(
          new URL("/patient/dashboard", request.url)
        );
      } else if (role === "birth_centers") {
        return NextResponse.redirect(
          new URL("/birth-center/dashboard", request.url)
        );
      } else {
        // If role is invalid, redirect to login
        return NextResponse.redirect(new URL("/login", request.url));
      }
    }

    return response;
  } catch (error) {
    // If there's an error parsing the user, redirect to login
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
