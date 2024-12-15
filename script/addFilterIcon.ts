import { connectToDatabase, disconnectFromDatabase } from "@/lib/mongoose";
import { CarDetail } from "@/models/Detail";

const updateIconPath = async () => {
  try {
    await connectToDatabase();

    await CarDetail.updateMany(
      {
        filterIcon: { $exists: false },
        name: { $in: ["make", "type"] },
      },
      [
        {
          $set: {
            filterIcon: "$icon",
          },
        },
      ],
    );
    console.log("Add filter icon updated successfully");
  } catch (error) {
    console.error("Error adding filter icon:", error);
  } finally {
    await disconnectFromDatabase();
  }
};

updateIconPath();
