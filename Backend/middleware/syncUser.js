import { getAuth, clerkClient } from "@clerk/express";
import User from "../models/User.js";

export const syncUser = async (req, res, next) => {
  try {
    const { userId } = getAuth(req);

   // console.log("SYNC USER ID:", userId);

    // User is not logged in
    if (!userId) {
      return next();
    }

    // Check MongoDB
    const existingUser = await User.findOne({
      clerkId: userId,
    });

  //  console.log("EXISTING USER:", existingUser ? "YES" : "NO");

    // User already exists
    if (existingUser) {
      return next();
    }

    // User doesn't exist → get user from Clerk
   // console.log("Fetching user from Clerk:", userId);

    const clerkUser =
      await clerkClient.users.getUser(userId);

   // console.log("Clerk user fetched:", clerkUser.id);

    // Create MongoDB user
    const user = await User.create({
      clerkId: userId,
      email:
        clerkUser.emailAddresses?.[0]?.emailAddress || "",
      name:
        `${clerkUser.firstName || ""} ${
          clerkUser.lastName || ""
        }`.trim(),
    });

   // console.log("✅ MongoDB user created:", user._id);

    return next();

  } catch (error) {
    console.error("❌ syncUser ERROR:");
    console.error(error);

    return next(error);
  }
};