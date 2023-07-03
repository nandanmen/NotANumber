"use client";

import React from "react";

interface User {
  name: string;
  email: string;
  username: string;
  image: string;
}

interface Session {
  user: User;
  expires: string;
  access_token: string;
}

const AuthContext = React.createContext<Session | undefined>(null);

export const useSession = (): Session | undefined => {
  return React.useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [session, setSession] = React.useState();

  React.useEffect(() => {
    const fetchSession = async () => {
      const res = await fetch("/api/auth/session");
      const json = await res.json();
      setSession(json);
    };
    fetchSession();
  }, []);

  return (
    <AuthContext.Provider value={session}>{children}</AuthContext.Provider>
  );
};
