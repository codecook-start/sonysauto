import { connectToDatabase, disconnectFromDatabase } from "@/lib/mongoose";
import { Car } from "@/models/Car";
import { CarDetail } from "@/models/Detail";
import { Types } from "mongoose";

const addAllCarDetails = async () => {
  try {
    await connectToDatabase();
    const cars = await Car.find();
    const details = await CarDetail.find();
    for (const car of cars) {
      const carDetails = car.details.map((detail) => detail.detail.toString());
      for (const detail of details as { _id: string }[]) {
        if (!carDetails.includes(detail._id.toString())) {
          console.log("Car details:", carDetails);
          console.log("Detail id:", detail._id.toString());
          car.details.push({
            detail: new Types.ObjectId(detail._id),
            option: null, // Assuming this is the default value
            showInDetailsPage: false, // Set default value
            showInListPage: false, // Set default value
          });
        }
      }
      await car.save();
    }
    console.log("Car details updated successfully");
  } catch (error) {
    console.error("Error updating car details:", error);
  } finally {
    await disconnectFromDatabase();
  }
};

addAllCarDetails();
