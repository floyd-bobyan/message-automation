import { useEffect, useState } from "react";

const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

const GoogleLoginButton = () => {
  const [user, setUser] = useState(null);

  // Load user from sessionStorage on mount
  useEffect(() => {
    const storedUser = sessionStorage.getItem("googleUser");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  // Load gapi script in browser
  useEffect(() => {
    if (typeof window === "undefined") return; // SSR guard

    const script = document.createElement("script");
    script.src = "https://apis.google.com/js/platform.js";
    script.async = true;
    script.defer = true;
    script.onload = initGapi;
    document.body.appendChild(script);

    function initGapi() {
      if (typeof gapi === "undefined") return;

      gapi.load("auth2", () => {
        gapi.auth2.init({
          client_id: CLIENT_ID,
          scope: "profile email",
        });
      });
    }

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const onSignIn = async () => {
    if (typeof gapi === "undefined") return;

    const authInstance = gapi.auth2.getAuthInstance();
    const googleUser = await authInstance.signIn();

    const profile = googleUser.getBasicProfile();
    const userData = {
      id: profile.getId(),
      name: profile.getName(),
      email: profile.getEmail(),
      imageUrl: profile.getImageUrl(),
    };

    sessionStorage.setItem("googleUser", JSON.stringify(userData));
    setUser(userData);
  };

  const onSignOut = () => {
    if (typeof gapi === "undefined") return;

    const authInstance = gapi.auth2.getAuthInstance();
    authInstance.signOut().then(() => {
      sessionStorage.removeItem("googleUser");
      setUser(null);
      console.log("User signed out");
    });
  };

  if (!user) {
    return (
      <button onClick={onSignIn} style={{ padding: "8px 16px", cursor: "pointer" }}>
        Login with Google
      </button>
    );
  }

  return (
    <div>
      <p>Welcome, {user.name}</p>
      <p>Email: {user.email}</p>
      <img src={user.imageUrl} alt="Profile" width={50} style={{ borderRadius: "50%" }} />
      <br />
      <button onClick={onSignOut} style={{ padding: "6px 12px", marginTop: "8px" }}>
        Sign Out
      </button>
    </div>
  );
};

export default GoogleLoginButton;
