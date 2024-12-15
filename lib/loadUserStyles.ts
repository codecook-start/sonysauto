import path from "path";
import fs from "fs";

export const loadUserStyles = (): string | null => {
  const filePath = path.join(
    process.cwd(),
    "public/uploads",
    "user-styles.css",
  );
  if (fs.existsSync(filePath)) {
    return fs.readFileSync(filePath, "utf-8");
  }
  return null;
};
