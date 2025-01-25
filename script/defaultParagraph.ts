import { connectToDatabase, disconnectFromDatabase } from "@/lib/mongoose";
import { SellerNoteText } from "@/models/SellerText";

const defaultParagraph = async () => {
  try {
    await connectToDatabase();
    const paragraphs = await SellerNoteText.find();
    for (const paragraph of paragraphs) {
      if (paragraph.text.includes("background-color: rgb(255, 255, 255);")) {
        paragraph.text = paragraph.text.replace(
          "background-color: rgb(255, 255, 255);",
          "",
        );
        await paragraph.save();
      }
    }
  } catch (error) {
    console.error("Error connecting to database", error);
  } finally {
    await disconnectFromDatabase();
  }
};

defaultParagraph();
