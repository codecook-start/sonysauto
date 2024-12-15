import { connectToDatabase, disconnectFromDatabase } from "@/lib/mongoose";
import { User } from "@/models/User";
import { hashPassword } from "@/lib/auth";

async function createAdminUser() {
  try {
    await connectToDatabase();

    const existingAdmin = await User.findOne({ email: "admin@example.com" });

    if (existingAdmin) {
      console.log("Admin already exists.");
      return;
    }

    const hashedPassword = await hashPassword("admin_password");
    const newAdmin = new User({
      name: "Admin",
      email: "admin@example.com",
      password: hashedPassword,
      role: "admin",
    });

    await newAdmin.save();
    console.log("Admin user created successfully");
  } catch (error) {
    console.error("Error creating admin user:", error);
    await disconnectFromDatabase();
  }
}

createAdminUser();
