import { connectToDatabase, disconnectFromDatabase } from "@/lib/mongoose";
import { Car } from "@/models/Car";
import { Ordering } from "@/models/Ordering";
import { Types } from "mongoose";

const fillCarOrdering = async () => {
  try {
    await connectToDatabase();
    const cars = await Car.find();
    for (const car of cars) {
      for (const page of car.pages) {
        const ordering = await Ordering.findOne({ name: "Car", page });
        if (ordering) {
          ordering.ids.push(car._id as Types.ObjectId);
          await ordering.save();
        } else {
          await Ordering.create({
            name: "Car",
            page,
            ids: [car._id],
          });
        }
      }
    }
  } catch (error) {
    console.error("Error connecting to database", error);
  } finally {
    await disconnectFromDatabase();
  }
};

fillCarOrdering();
