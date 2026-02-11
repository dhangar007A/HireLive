import React from 'react'
import toast from "react-hot-toast"
import { SignedOut, SignedIn, SignInButton, SignOutButton, UserButton } from "@clerk/clerk-react"


function HomePage() {
    return (
        <div>
            <button className="btn btn-secondary" onClick={() => toast.error("This is a success Toast")}>Click me</button>

            <SignedOut>
                <SignInButton mode="modal">
                    <button>Login</button>
                </SignInButton>
            </SignedOut>

            <SignedIn>
                <SignOutButton />
            </SignedIn>

            <UserButton />

        </div>
    )
}

export default HomePage

// 