import { connectToDatabase, disconnectFromDatabase } from "@/lib/mongoose";
import { CarDetail } from "@/models/Detail";

const updateIconPath = async () => {
  try {
    await connectToDatabase();

    await CarDetail.updateMany({ icon: null }, [
      {
        $set: {
          icon: "api/uploads/car-detail-option-icon-1730956378204-suv.png",
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
