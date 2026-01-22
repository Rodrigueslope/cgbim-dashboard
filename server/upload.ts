import { Router } from "express";
import { storagePut } from "./storage";

export const uploadRouter = Router();

uploadRouter.post("/upload-material", async (req, res) => {
  try {
    const { fileName, fileData, contentType } = req.body;

    if (!fileName || !fileData || !contentType) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Converter base64 para Buffer
    const buffer = Buffer.from(fileData, 'base64');

    // Gerar nome único para o arquivo
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(7);
    const fileKey = `materiais/${timestamp}-${randomSuffix}-${fileName}`;

    // Upload para S3
    const { url } = await storagePut(fileKey, buffer, contentType);

    res.json({ url });
  } catch (error) {
    console.error("Erro no upload:", error);
    res.status(500).json({ error: "Erro ao fazer upload do arquivo" });
  }
});
