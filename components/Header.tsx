import Link from "next/link";
import { SignInButton, UserButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { ModeToggle } from "./ModeToggle";

const Header = () => {
  return (
    <header className="bg-secondary text-secondary-foreground shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-highlight">
          Fantasy Sports AI
        </Link>
        <nav>
          <ul className="flex space-x-4 items-center">
            <li>
              <Link href="/dashboard" className="hover:text-highlight">
                Dashboard
              </Link>
            </li>
            <li>
              <Link href="/players" className="hover:text-highlight">
                Players
              </Link>
            </li>
            <li>
              <Link href="/league" className="hover:text-highlight">
                League
              </Link>
            </li>
            <li>
              <ModeToggle />
            </li>
            <li>
              <SignedIn>
                <UserButton />
              </SignedIn>
              <SignedOut>
                <SignInButton />
              </SignedOut>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
