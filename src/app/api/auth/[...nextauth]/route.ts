// import { authOptions } from '@/app/api/auth/[...nextauth]/route';
//---/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { connectToDB } from "../../../../utils/database";
import User from "../../../../models/user";

console.log({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
});

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
  callbacks: {
    async session({ session }) {
      if (!session.user || !session.user.email) {
        return session;
      }

      const sessionUser = await User.findOne({
        email: session.user.email,
      });

      if (sessionUser) {
        // Ensure sessionUser is found
        session.user.id = sessionUser._id.toString();
      }

      return session;
    },
    async signIn({ profile }) {
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
            username = `<span class="math-inline">\{username\}</span>{Math.floor(Math.random() * 10000)}`;
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
