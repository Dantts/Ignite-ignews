import { query as q } from "faunadb";
import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";

import { faunaClient } from "../../../services/fauna";

export default NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    session: async (session: any) => {
      const { session: userSession } = session;

      try {
        const userActiveSubscription = await faunaClient.query(
          q.Get(
            q.Intersection([
              q.Match(
                q.Index("subscription_by_user_ref"),
                q.Select(
                  "ref",
                  q.Get(
                    q.Match(
                      q.Index("user_by_email"),
                      q.Casefold(userSession.user.email)
                    )
                  )
                )
              ),
              q.Match(q.Index("subscription_by_status"), "active"),
            ])
          )
        );

        return { ...session, activeSubscription: userActiveSubscription };
      } catch {
        return { ...session, activeSubscription: null };
      }
    },
    signIn: async ({ user }) => {
      const { name, email, image } = user;

      try {
        await faunaClient.query(
          q.If(
            q.Not(
              q.Exists(
                q.Match(q.Index("user_by_email"), q.Casefold(email ?? ""))
              )
            ),
            q.Create(q.Collection("users"), {
              data: { name, email, image },
            }),
            q.Get(q.Match(q.Index("user_by_email"), q.Casefold(email ?? "")))
          )
        );
        return true;
      } catch (err) {
        console.log(err);
        return false;
      }
    },
  },
});
