import './App.css'
import { SignedOut, SignedIn, SignInButton, SignOutButton, UserButton } from "@clerk/clerk-react"

/**
 * Root React component that renders a welcome header and Clerk authentication UI.
 *
 * Renders a header and authentication controls: a modal sign-in button when signed out,
 * a sign-out button when signed in, and a persistent user controls button.
 * @returns {JSX.Element} The app's top-level React element.
 */
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