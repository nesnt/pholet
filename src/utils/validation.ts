/**
 * Utility validasi untuk autentikasi dan berkas media Pholet.
 */

export interface PasswordValidationResult {
  isValid: boolean;
  hasMinLength: boolean;
  hasSpecialChar: boolean;
  errors: string[];
}

/**
 * Regex untuk mendeteksi setidaknya satu karakter unik / simbol non-alfanumerik.
 * Mencakup karakter khusus seperti !@#$%^&*()_+-=[]{}|;':",./<>?`~ dll.
 */
export const SPECIAL_CHAR_REGEX = /[^A-Za-z0-9]/;

/**
 * Memvalidasi password dengan aturan:
 * 1. Minimal 8 karakter
 * 2. Mengandung minimal 1 karakter unik / simbol
 */
export function validatePassword(password: string): PasswordValidationResult {
  const pwd = password || "";
  const hasMinLength = pwd.length >= 8;
  const hasSpecialChar = SPECIAL_CHAR_REGEX.test(pwd);
  const errors: string[] = [];

  if (!hasMinLength) {
    errors.push("Password minimal harus 8 karakter.");
  }

  if (!hasSpecialChar) {
    errors.push("Password harus mengandung minimal satu karakter unik / simbol (contoh: !@#$%^&*).");
  }

  return {
    isValid: hasMinLength && hasSpecialChar,
    hasMinLength,
    hasSpecialChar,
    errors,
  };
}

/**
 * Batas ukuran berkas foto maksimal (10 MB).
 */
export const MAX_PHOTO_SIZE_MB = 10;
export const MAX_PHOTO_SIZE_BYTES = MAX_PHOTO_SIZE_MB * 1024 * 1024;

export const ALLOWED_PHOTO_EXTENSIONS = [
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".avif",
  ".heic",
  ".heif",
] as const;

export const ALLOWED_PHOTO_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/heic",
  "image/heif",
] as const;

/**
 * Memeriksa apakah ekstensi berkas foto diizinkan.
 */
export function isAllowedPhotoExtension(fileName: string): boolean {
  const extIndex = fileName.lastIndexOf(".");
  if (extIndex === -1) return false;
  const ext = fileName.substring(extIndex).toLowerCase();
  return (ALLOWED_PHOTO_EXTENSIONS as readonly string[]).includes(ext);
}

/**
 * Memeriksa apakah MIME type berkas foto diizinkan.
 */
export function isAllowedPhotoMime(mimeType: string, fileName?: string): boolean {
  const normalizedMime = (mimeType || "").toLowerCase();
  if ((ALLOWED_PHOTO_MIME_TYPES as readonly string[]).includes(normalizedMime)) {
    return true;
  }
  // Toleransi jika browser melaporkan tipe image generik dengan ekstensi yang sah
  if (fileName && normalizedMime.startsWith("image/") && isAllowedPhotoExtension(fileName)) {
    return true;
  }
  return false;
}

export interface PhotoSizeValidationResult {
  isValid: boolean;
  error?: string;
  sizeInMB: number;
}

/**
 * Memvalidasi ukuran foto agar berada di bawah / maksimal 10 MB.
 */
export function validatePhotoSize(sizeInBytes: number): PhotoSizeValidationResult {
  const sizeInMB = Number((sizeInBytes / (1024 * 1024)).toFixed(2));

  if (sizeInBytes <= 0) {
    return {
      isValid: false,
      error: "Berkas foto kosong atau tidak valid (0 bytes).",
      sizeInMB: 0,
    };
  }

  if (sizeInBytes > MAX_PHOTO_SIZE_BYTES) {
    return {
      isValid: false,
      error: `Ukuran foto (${sizeInMB} MB) melebihi batas maksimal ${MAX_PHOTO_SIZE_MB}MB! Harap pilih berkas foto dengan ukuran di bawah 10 MB.`,
      sizeInMB,
    };
  }

  return {
    isValid: true,
    sizeInMB,
  };
}

/**
 * Validasi Magic Bytes biner untuk memastikan keaslian header file foto
 * (Mencegah file executable/dokumen berbahaya yang diganti namanya menjadi .jpg).
 * Kompatibel dengan Uint8Array dan Node.js Buffer tanpa alokasi memori string tambahan.
 */
export function isValidImageHeader(buf: Uint8Array): boolean {
  if (!buf || buf.length < 12) return false;

  // JPEG: FF D8 FF
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return true;

  // PNG: 89 50 4E 47
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) return true;

  // WebP: RIFF .... WEBP
  const isRiff = buf[0] === 0x52 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x46;
  const isWebp = buf[8] === 0x57 && buf[9] === 0x45 && buf[10] === 0x42 && buf[11] === 0x50;
  if (isRiff && isWebp) return true;

  // HEIC / AVIF: offset 4 'ftyp' (0x66 0x74 0x79 0x70)
  if (buf[4] === 0x66 && buf[5] === 0x74 && buf[6] === 0x79 && buf[7] === 0x70) return true;

  return false;
}
