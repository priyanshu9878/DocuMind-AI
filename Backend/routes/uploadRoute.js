import upload from "./middleware/upload.js";
import { getAuth } from "@clerk/express";
import { indexing } from "./indexing.js";
import User from "./models/User.js";
import File from "./models/File.model.js";

app.post("/upload", upload.single("pdf"), async (req, res) => {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

   // console.log("Uploaded file:", req.file);

    await indexing(
      req.file.path,
      userId,
      req.file.originalname
    );

    // Find Mongo user
    const user = await User.findOne({
      clerkId: userId,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
   // console.log("Before File.create");
   // console.log("Mongo User:", user);

    // Save file metadata
    const file = await File.create({
      userId: user._id,
      fileName: req.file.originalname,
      filePath: req.file.path,
    });
    console.log("After File.create");
   // console.log(file);  

    console.log("Saved File:", file);

    res.status(200).json({
  success: true,
  message: "PDF uploaded and indexed",
  fileId: file._id.toString(),
});

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Upload failed",
    });
  }
});