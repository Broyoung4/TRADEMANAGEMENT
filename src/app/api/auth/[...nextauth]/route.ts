// import { authOptions } from '@/app/api/auth/[...nextauth]/route';
//---/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { connectToDB } from "../../../../utils/database";
import User from "../../../../models/user";

/* console.log({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
}); */

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error("Missing Google OAuth environment variables");
}

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  // Session configuration for "Remember me" functionality
  session: {
    strategy: "jwt" as const, // Use JWT instead of database sessions
    maxAge: 30 * 24 * 60 * 60, // 30 days - long session duration for "Remember me"
    updateAge: 24 * 60 * 60, // Update session once per day
  },
  // JWT configuration
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days - matches session maxAge
  },
  // Pages configuration
  pages: {
    signIn: "/login", // Custom login page (optional)
  },
  callbacks: {
    // JWT callback - runs when JWT is created or updated
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    // Session callback - runs when session is checked
    async session({ session, token }: any) {
      if (session.user) {
        session.user.id = token.id;
      }

      if (!session.user || !session.user.email) {
        return session;
      }

      await connectToDB();
      const sessionUser = await User.findOne({
        email: session.user.email,
      });

      if (sessionUser) {
        session.user.id = sessionUser._id.toString();
      }

      return session;
    },
    async signIn({ profile }: any) {
      if (!profile) {
        console.error("SignIn callback: Profile or email missing.");
        return false;
      }
      try {
        await connectToDB();

        const userExists = await User.findOne({ email: profile.email });

        if (!userExists) {
          let username = profile.name
            ? profile.name.replace(/\s/g, "").toLowerCase()
            : `user${Date.now()}`; // Make username more unique if name is missing
          // Check if generated username exists, append random numbers if it does (simplified here)
          const potentialExistingUsername = await User.findOne({
            username: username,
          });
          if (potentialExistingUsername) {
            username = `${username}${Math.floor(Math.random() * 10000)}`;
          }

          await User.create({
            email: profile.email,
            username: profile.name
              ? profile.name.replace(/\s/g, "").toLowerCase()
              : "user",
            image: profile.image,
          });
        }

        return true;
      } catch (error) {
        console.error("Error in signIn callback: ", error);
        return false;
      }
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
