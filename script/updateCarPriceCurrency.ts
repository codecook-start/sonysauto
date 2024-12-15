import { connectToDatabase, disconnectFromDatabase } from "@/lib/mongoose";
import { Car } from "@/models/Car";

const updateIconPath = async () => {
  try {
    await connectToDatabase();
    const cars = await Car.find();
    for (const car of cars) {
      if (car.price && !car.price.includes("CI$")) {
        car.price = `CI$${car.price}`;
        await car.save();
      }
    }
    console.log("Icon paths updated successfully");
  } catch (error) {
    console.error("Error updating icon paths:", error);
  } finally {
    await disconnectFromDatabase();
  }
};

updateIconPath();
