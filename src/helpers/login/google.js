import { useEffect, useState } from "react";

const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

const GoogleLoginButton = () => {
  const [user, setUser] = useState(null);

  // Load gapi script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://apis.google.com/js/platform.js";
    script.async = true;
    script.defer = true;
    script.onload = initGapi;
    document.body.appendChild(script);
  }, []);

  const initGapi = () => {
    gapi.load("auth2", () => {
      gapi.auth2.init({
        client_id: CLIENT_ID,
        scope: "profile email",
      });
    });
  };

  const onSignIn = async () => {
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
    const authInstance = gapi.auth2.getAuthInstance();
    authInstance.signOut().then(() => {
      sessionStorage.removeItem("googleUser");
      setUser(null);
      console.log("User signed out");
    });
  };

  // Load user from sessionStorage on mount
  useEffect(() => {
    const storedUser = sessionStorage.getItem("googleUser");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  if (!user) {
    return <button onClick={onSignIn}>Login with Google</button>;
  }

  return (
    <div>
      <p>Welcome, {user.name}</p>
      <p>Email: {user.email}</p>
      <img src={user.imageUrl} alt="Profile" width={50} />
      <br />
      <button onClick={onSignOut}>Sign Out</button>
    </div>
  );
};

export default GoogleLoginButton;
