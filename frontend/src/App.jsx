import './App.css'
import { SignedOut, SignedIn, SignInButton, SignOutButton, UserButton } from "@clerk/clerk-react"

function App() {
  return (
    <>
      <h1>Welcome to My App</h1>

      <SignedOut>
      <SignInButton mode='modal'>
        <button>Sign In</button>
      </SignInButton>
      </SignedOut>

      <SignedIn>
        <SignOutButton/>
      </SignedIn>


      <UserButton />


    </>
  )
}

export default App
