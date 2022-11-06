import { Product } from "../models";
import multer from "multer";
import path from "path";
import CustomErrorHandler from "../services/CustomErrorHandler";
import Joi from "joi";
import fs from "fs";
import productSchema from "../validators/productValidator";

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${path.extname(file.originalname)}`;
    // 3746674586-836534453.png
    cb(null, uniqueName);
  },
});

const handleMultipartData = multer({
  storage,
  limits: { fileSize: 1000000 * 5 },
}).single("image"); // 5mb

const productController = {
  async store(req, res, next) {
    // MULTIPART FORM DATA
    handleMultipartData(req, res, async (err) => {
      if (err) {
        return next(CustomErrorHandler.serverError(err.message));
      }

      const filePath = req.file.path;

      const { error } = productSchema.validate(req.body);

      if (error) {
        // DELETE THE UPLOADED FILE
        if (req.file) {
          fs.unlink(`${appRoot}/${filePath}`, (error) => {
            if (error) {
              return next(CustomErrorHandler.serverError(error.message));
            }
          });
          return next(error);
        }
      }

      const { name, price, size } = req.body;

      let document;
      try {
        document = await Product.create({
          name,
          price,
          size,
          image: filePath,
        });
      } catch (error) {
        return next(error);
      }

      res.status(201).json({ document });
    });
  },

  async update(req, res, next) {
    // MULTIPART FORM DATA
    handleMultipartData(req, res, async (err) => {
      if (err) {
        return next(CustomErrorHandler.serverError(err.message));
      }

      let filePath;
      if (req.file) {
        filePath = req.file.path;
      }

      const { error } = productSchema.validate(req.body);

      if (error) {
        // DELETE THE UPLOAD FILE
        fs.unlink(`${appRoot}/${filePath}`, (error) => {
          if (error) {
            return next(CustomErrorHandler.serverError(error.message));
          }
        });
        return next(error);
      }

      const { name, price, size } = req.body;

      let document;
      try {
        document = await Product.findOneAndUpdate(
          { _id: req.params.id },
          {
            name,
            price,
            size,
            ...(req.file && { image: filePath }),
          },
          { new: true }
        );
      } catch (error) {
        return next(error);
      }

      res.status(201).json({ document });
    });
  },
};

export default productController;
