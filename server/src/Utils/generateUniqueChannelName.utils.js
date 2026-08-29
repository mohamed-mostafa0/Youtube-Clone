import crypto from "crypto";
import { userModel } from "../DB/Models/index.js";

export async function generateUniqueChannelName(name) {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .slice(0, 15);

  while (true) {
    const suffix = crypto.randomBytes(3).toString("hex");

    const uniqueChannelName = `@${base}${suffix}`;

    const exists = await userModel.exists({ uniqueChannelName });

    if (!exists) {
      return uniqueChannelName;
    }
  }
}