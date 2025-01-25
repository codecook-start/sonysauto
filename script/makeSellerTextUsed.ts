import { connectToDatabase, disconnectFromDatabase } from "@/lib/mongoose";
import { SellerNoteText } from "@/models/SellerText";

const makeSellerTextUsed = async () => {
  try {
    await connectToDatabase();
    const texts = await SellerNoteText.find();
    for (const text of texts) {
      text.used = true;
      await text.save();
    }
  } catch (error) {
    console.error("Error connecting to database:", error);
  } finally {
    await disconnectFromDatabase();
  }
};

makeSellerTextUsed();
