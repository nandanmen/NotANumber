import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";

export default NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      profile(profile) {
        return {
          id: profile.id,
          name: profile.name,
          username: profile.login,
          email: profile.email,
          avatar: profile.avatar_url,
        };
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, account, user }) => {
      if (user) {
        // @ts-ignore
        token.picture = user.avatar;
        // @ts-ignore
        token.username = user.username;
      }
      if (account) {
        token.access_token = account.access_token;
      }
      return token;
    },
    session: async ({ session, token }) => {
      // @ts-ignore
      session.user.username = token.username;
      // @ts-ignore
      session.access_token = token.access_token;
      return session;
    },
  },
});
