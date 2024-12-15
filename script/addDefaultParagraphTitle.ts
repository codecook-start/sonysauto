import { connectToDatabase, disconnectFromDatabase } from "@/lib/mongoose";
import { SellerNoteText } from "@/models/SellerText";

const updateIconPath = async () => {
  try {
    await connectToDatabase();

    await SellerNoteText.updateMany(
      {
        title: { $exists: false },
      },
      {
        title: "Default Paragraph Title",
      },
    );

    console.log(
      "Successfully updated all SellerNoteText documents with missing title field.",
    );
  } catch (error) {
    console.error(
      "An error occurred while updating SellerNoteText documents with missing title field:",
      error,
    );
  } finally {
    await disconnectFromDatabase();
  }
};

updateIconPath();
