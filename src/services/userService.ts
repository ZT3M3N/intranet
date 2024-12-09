import { User } from "@/models/User";
import { connectDB } from "@/lib/mongodb";

export const UserService = {
  async getAllUsers() {
    await connectDB();
    return User.find({}, { password: 0 }).sort({ createdAt: -1 });
  },

  async updateUser(id: string, userData: Partial<typeof User>) {
    await connectDB();
    return User.findByIdAndUpdate(
      id,
      { $set: userData },
      { new: true, select: "-password" }
    );
  },

  async deleteUser(id: string) {
    await connectDB();
    return User.findByIdAndDelete(id);
  },
};
