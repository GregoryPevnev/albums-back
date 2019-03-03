import { Router } from "express";
import Bundle from "../bundle";
import { isAppError } from "../../application/common/errors";

const createUploadApi = ({ getUploadURL }: Bundle) => {
    const uploadApi = Router(); // Add middleware to other side

    // Returns appropriate url depending on provided filename
    uploadApi.get("/url", async (req, res) => {
        try {
            const { filename } = req.query;
            if (!filename) return res.status(400).json({ error: { type: "filename required" } });
            return res.status(200).json(getUploadURL(filename));
        } catch (e) {
            console.log("Cannot Post Review:", e);
            if (!isAppError(e)) return res.status(500).json({ error: { type: "server" } });
            return res.status(400).json({ error: e });
        }
    });

    return uploadApi;
};

export default createUploadApi;
