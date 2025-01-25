import { connectToDatabase, disconnectFromDatabase } from "@/lib/mongoose";
import { Car } from "@/models/Car";

const fillCarPages = async () => {
  try {
    await connectToDatabase();
    const cars = await Car.find({
      $or: [{ pages: { $exists: false } }, { pages: { $size: 0 } }],
    });
    const pages = ["japan"];
    for (const car of cars) {
      car.pages = pages;
      await car.save();
    }
  } catch (error) {
    console.error("Error connecting to database", error);
  } finally {
    await disconnectFromDatabase();
  }
};

fillCarPages();
