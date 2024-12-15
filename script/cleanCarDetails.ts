import { connectToDatabase, disconnectFromDatabase } from "@/lib/mongoose";
import { CarDetail } from "@/models/Detail";

const updateIconPath = async () => {
  try {
    await connectToDatabase();
    await CarDetail.deleteMany({
      values: { $in: [null, "", "null", "-", "", []] },
    });
    console.log(
      'Car details with values [null], [""], ["null"], ["-"], [""] deleted successfully',
    );
  } catch (error) {
    console.error("Error adding filter icon:", error);
  } finally {
    await disconnectFromDatabase();
  }
};

updateIconPath();
