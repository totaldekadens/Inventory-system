import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/models/UserModel";
import dbConnect from "@/lib/dbConnect";

export const authOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      credentials: {
        inputValue: {
          label: "username",
          type: "text",
          placeholder: "Username",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { inputValue, password } = credentials;

        await dbConnect();

        const user = await User.findOne({ username: inputValue }).then(
          (res) => {
            if (!res) {
              throw Error("invalid user");
            }
            if (res) {
              if (res.validPassword(String(password))) {
                return res;
              }
              throw Error("incorrect password");
            }
            throw Error("invalid user");
          }
        );
        return user;
      },
    }),
  ],
  pages: {
    signIn: "/signin",
  },
  session: {
    strategy: "jwt",
    maxAge: 6 * 60 * 60, // 6 hours
  },
  callbacks: {
    async jwt({ token, user }) {
      await dbConnect();
      if (user) {
        token.id = user.id;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.email = user.email;
      }
      return Promise.resolve(token);
    },
    async session({ session, token }) {
      session.id = token.id;
      session.user.firstName = token.firstName;
      session.user.lastName = token.lastName;
      session.user.email = token.email;
      session.user.id = token.id;

      return session;
    },
  },
};
export default NextAuth(authOptions);
