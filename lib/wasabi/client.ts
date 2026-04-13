// lib/wasabi/client.ts
import { S3Client, DeleteObjectCommand, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const wasabi = new S3Client({
  region: process.env.WASABI_REGION!,
  endpoint: process.env.WASABI_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.WASABI_ACCESS_KEY_ID!,
    secretAccessKey: process.env.WASABI_SECRET_ACCESS_KEY!,
  },
  forcePathStyle: true,
})

const BUCKET = process.env.WASABI_BUCKET_NAME!

export async function getUploadUrl(key: string, mimeType: string, fileSizeBytes: number): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    ContentType: mimeType,
    ContentLength: fileSizeBytes,
  })
  return getSignedUrl(wasabi, command, { expiresIn: 900 })
}

export async function getDownloadUrl(key: string): Promise<string> {
  const command = new GetObjectCommand({ Bucket: BUCKET, Key: key })
  return getSignedUrl(wasabi, command, { expiresIn: 900 })
}

export async function deleteObject(key: string): Promise<void> {
  await wasabi.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }))
}
