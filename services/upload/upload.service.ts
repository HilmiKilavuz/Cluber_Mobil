// services/upload/upload.service.ts
// Cloudinary'e multipart/form-data ile resim yükleme

import { axiosInstance } from '@/services/axiosInstance';

export interface UploadResponse {
  url: string;
  publicId: string;
}

export const uploadService = {
  uploadImage: async (uri: string, fileName?: string): Promise<UploadResponse> => {
    const formData = new FormData();

    // React Native'de FormData için özel tip gerekli
    formData.append('file', {
      uri,
      type: 'image/jpeg',
      name: fileName ?? 'upload.jpg',
    } as unknown as Blob);

    const response = await axiosInstance.post<UploadResponse>('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },
};
