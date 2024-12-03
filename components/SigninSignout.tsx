"use client"
import { Button } from "@/components/ui/button";
import { signIn, signOut, useSession } from "next-auth/react";

export function SigninSignout(){
    const session = useSession();
    return (
        <div>
            {session.data?.user && <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold" onClick={() => signOut()}>Logout</Button>}
            {!session.data?.user && <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold" onClick={() => signIn()}>Sign in</Button>}
        </div>
    )
}