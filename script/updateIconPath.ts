import { connectToDatabase, disconnectFromDatabase } from "@/lib/mongoose";
import { CarDetail } from "@/models/Detail";

const updateIconPath = async () => {
  try {
    await connectToDatabase();

    await CarDetail.updateMany({ icon: { $regex: "^/uploads" } }, [
      {
        $set: {
          icon: { $concat: ["api", "$icon"] },
        },
      },
    ]);
    console.log("Icon paths updated successfully");
  } catch (error) {
    console.error("Error updating icon paths:", error);
  } finally {
    await disconnectFromDatabase();
  }
};

updateIconPath();
