import cloudinary from '../config/cloudinary.config';
import { Readable } from 'stream';
import { AppErrors } from '../errors/app.errors';
import { Request, Response } from 'express';

export interface CloudinaryUploadResponse {
  public_id: string;
  secure_url: string;
  url: string;
  width: number;
  height: number;
  format: string;
  [key: string]: any;
}

export class CloudinaryService {
  /**
   * Upload image to Cloudinary from Express multer file
   * @param file - multer file object
   * @param folder - optional folder path in Cloudinary
   * @returns promise with upload result containing secure_url
   */
  static async uploadImage(
    file: any,
    folder: string = 'salon-booking'
  ): Promise<CloudinaryUploadResponse> {
    try {
      if (!file) {
        throw new AppErrors('No file provided');
      }

      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: folder,
            resource_type: 'auto',
            allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
          },
          (error: any, result: any) => {
            if (error) {
              reject(new AppErrors(`Upload failed: ${error.message}`));
            } else {
              resolve(result);
            }
          }
        );

        // Convert buffer to stream and pipe to Cloudinary
        const bufferStream = Readable.from(file.buffer);
        bufferStream.pipe(uploadStream);
      });
    } catch (error) {
      throw new AppErrors(`Image upload error: ${error}`);
    }
  }

  /**
   * Delete image from Cloudinary by public_id
   * @param publicId - Cloudinary public_id of the image
   */
  static async deleteImage(publicId: string): Promise<any> {
    try {
      if (!publicId) {
        throw new AppErrors('Public ID is required');
      }

      return new Promise((resolve, reject) => {
        cloudinary.uploader.destroy(publicId, (error: any, result: any) => {
          if (error) {
            reject(new AppErrors(`Delete failed: ${error.message}`));
          } else {
            resolve(result);
          }
        });
      });
    } catch (error) {
      throw new AppErrors(`Image deletion error: ${error}`);
    }
  }
}
