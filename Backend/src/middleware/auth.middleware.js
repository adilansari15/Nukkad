import { getAuth } from "@clerk/express";
import User from "../models/user.model.js";

export async function protectRoute(req, res, next) {
    try {
        const { userId } = getAuth(req);
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const user = await User.findOne({ clerkId: userId });

        if (!user) {
            res.status(401).json({ message: "User Profile Is Not Sync yet" });
            return;
        }

        req.user = user

        next()

    } catch (error) {
        console.log("error in protected middleware:", error.message);
        
    }
}