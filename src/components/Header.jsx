import React, { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "./ui/button";
import {
  UserButton,
  SignedOut,
  SignedIn,
  SignIn,
  useUser,
} from "@clerk/clerk-react";
import { Briefcase, Heart, PenBox } from "lucide-react";
import { House } from "lucide-react";

const Header = () => {
  const [showSignIn, setshowSignIn] = React.useState(false);
  const [search, setSearch] = useSearchParams();
  const { user } = useUser();

  useEffect(() => {
    if (search.get("signIn") === "true") {
      setshowSignIn(true);
    }
  }, [search]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      setshowSignIn(false);
      setSearch({});
    }
  };
  return (
    <>
      <nav className="py-4 px-6 flex justify-between items-center border-b shadow-sm">
        <Link to="/" className="flex items-center">
          <img src="/logo.png" className="h-14 sm:h-20" />
        </Link>

        <div className="flex items-center gap-8 sm:gap-6">
          {/* Home icon */}
          <Link to="/" className="text-muted-foreground">
            <House size={24} />
          </Link>

          <SignedOut>
            <Button
              variant="outline"
              className="rounded-full px-4 py-2 text-sm"
              onClick={() => setshowSignIn(true)}
            >
              Login
            </Button>
          </SignedOut>

          <SignedIn>
            {user?.unsafeMetadata?.role === "recruiter" && (
              <Link to="/post-job">
                <Button
                  variant="destructive"
                  className="rounded-full flex items-center gap-2"
                >
                  <PenBox size={18} />
                  Post a Job
                </Button>
              </Link>
            )}

            <UserButton appearance={{ elements: { avatarBox: "h-10 w-10" } }}>
              <UserButton.MenuItems>
                <UserButton.Link
                  label="My Jobs"
                  labelIcon={<Briefcase size={15} />}
                  href="/my-jobs"
                />
                <UserButton.Link
                  label="Saved Jobs"
                  labelIcon={<Heart size={15} />}
                  href="/saved-jobs"
                />
              </UserButton.MenuItems>
            </UserButton>
          </SignedIn>
        </div>
      </nav>

      {showSignIn && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/50"
          onClick={handleOverlayClick}
        >
          <SignIn signUpForceRedirectUrl="/" fallbackRedirectUrl="/" />
        </div>
      )}
    </>
  );
};

export default Header;
