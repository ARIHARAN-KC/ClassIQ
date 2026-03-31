import { google } from "googleapis";
import { env } from "./env.js";

const oauth2Client = new google.auth.OAuth2(
  env.GOOGLE_CLIENT_ID,
  env.GOOGLE_CLIENT_SECRET,
  env.GOOGLE_REDIRECT_URI
);

oauth2Client.setCredentials({
  refresh_token: env.GOOGLE_REFRESH_TOKEN,
});

export const drive = google.drive({
  version: "v3",
  auth: oauth2Client,
});