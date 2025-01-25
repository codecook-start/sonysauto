import { connectToDatabase, disconnectFromDatabase } from "@/lib/mongoose";
import { Car } from "@/models/Car";

const updateCarPriceCurrency = async () => {
  try {
    await connectToDatabase();
    const cars = await Car.find();
    for (const car of cars) {
      if (car.price && !car.price.includes("CI$")) {
        car.price = `CI$${car.price}`;
        await car.save();
      }
    }
    console.log("Car prices updated successfully");
  } catch (error) {
    console.error("Error updating car prices", error);
  } finally {
    await disconnectFromDatabase();
  }
};

updateCarPriceCurrency();
