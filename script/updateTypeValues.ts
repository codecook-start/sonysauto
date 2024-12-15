import { connectToDatabase, disconnectFromDatabase } from "@/lib/mongoose";
import { CarDetail } from "@/models/Detail";

const updateIconPath = async () => {
  try {
    await connectToDatabase();

    await CarDetail.updateMany({ name: "type" }, [
      {
        $set: {
          values: { $slice: ["$values", 1] },
        },
      },
    ]);

    console.log("Values updated successfully.");
  } catch (error) {
    console.error("Error updating icon paths:", error);
  } finally {
    await disconnectFromDatabase();
  }
};

updateIconPath();
