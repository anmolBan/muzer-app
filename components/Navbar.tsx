import { Music } from "lucide-react";
import Link from "next/link";
import { SigninSignout } from "./SigninSignout";

export default function Navbar(){
    return (
        <header className="w-full px-4 lg:px-6 h-16 flex items-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100">
          <div className="container mx-auto flex items-center justify-between">
            <Link className="flex items-center justify-center" href="#">
              <Music className="h-6 w-6 text-blue-400" />
              <span className="ml-2 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">Muzer</span>
            </Link>
            <nav className="flex gap-4 sm:gap-6">
              <SigninSignout/>
            </nav>
          </div>
        </header>
    )
}