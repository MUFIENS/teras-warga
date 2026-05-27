import { z } from 'zod'

export const REPORT_CATEGORIES = [
  'Infrastruktur',
  'Kebersihan',
  'Keamanan',
  'Listrik dan Air',
  'Lingkungan',
] as const

export const REPORT_PRIORITIES = ['rendah', 'normal', 'tinggi', 'mendesak'] as const

export const REPORT_STATUSES = ['pending', 'reviewed', 'in_progress', 'resolved', 'rejected'] as const

export const createReportSchema = z.object({
  title: z
    .string()
    .min(3, 'Judul minimal 3 karakter')
    .max(100, 'Judul maksimal 100 karakter')
    .transform((v) => v.trim()),
  description: z
    .string()
    .min(10, 'Deskripsi minimal 10 karakter')
    .max(2000, 'Deskripsi maksimal 2000 karakter')
    .transform((v) => v.trim()),
  category: z.enum(REPORT_CATEGORIES).default('Infrastruktur'),
  location: z
    .string()
    .max(200, 'Lokasi maksimal 200 karakter')
    .transform((v) => v.trim())
    .optional()
    .default(''),
  priority: z.enum(REPORT_PRIORITIES).default('normal'),
})

export const addCommentSchema = z.object({
  content: z
    .string()
    .min(1, 'Komentar tidak boleh kosong')
    .max(1000, 'Komentar maksimal 1000 karakter')
    .transform((v) => v.trim()),
  reportId: z.string().uuid('ID laporan tidak valid'),
})

export const updateStatusSchema = z.object({
  reportId: z.string().uuid('ID laporan tidak valid'),
  status: z.enum(REPORT_STATUSES),
  adminNotes: z.string().max(1000, 'Catatan maksimal 1000 karakter').optional(),
})

export type CreateReportInput = z.infer<typeof createReportSchema>
export type AddCommentInput = z.infer<typeof addCommentSchema>
export type UpdateStatusInput = z.infer<typeof updateStatusSchema>

// --- PEMINJAMAN ---

export const BORROW_CATEGORIES = [
  'Alat Kebersihan',
  'Peralatan Acara',
  'Peralatan Olahraga',
  'Peralatan Kerja',
  'Barang Umum',
] as const

export const BORROW_STATUSES = ['pending', 'approved', 'borrowed', 'returned', 'rejected'] as const

export const createBorrowRequestSchema = z.object({
  itemId: z.string().uuid('ID barang tidak valid'),
  purpose: z
    .string()
    .min(5, 'Tujuan peminjaman minimal 5 karakter')
    .max(500, 'Tujuan peminjaman maksimal 500 karakter')
    .transform((v) => v.trim()),
  startDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Tanggal mulai tidak valid',
  }),
  endDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Tanggal selesai tidak valid',
  }),
}).refine((data) => new Date(data.startDate) <= new Date(data.endDate), {
  message: "Tanggal selesai harus setelah tanggal mulai",
  path: ["endDate"],
})

export const updateBorrowStatusSchema = z.object({
  requestId: z.string().uuid('ID request tidak valid'),
  status: z.enum(BORROW_STATUSES),
  adminNotes: z.string().max(500, 'Catatan maksimal 500 karakter').optional(),
})

export type CreateBorrowRequestInput = z.infer<typeof createBorrowRequestSchema>
export type UpdateBorrowStatusInput = z.infer<typeof updateBorrowStatusSchema>

// --- POSTS (BERANDA) ---

export const createPostSchema = z.object({
  content: z
    .string()
    .max(5000, 'Postingan maksimal 5000 karakter')
    .transform((v) => v.trim())
    .optional()
    .default(''),
  parent_id: z.string().uuid('ID parent tidak valid').optional().nullable(),
})

export type CreatePostInput = z.infer<typeof createPostSchema>

// --- PASAR ---

export const MARKET_CATEGORIES = [
  "Semua",
  "Elektronik",
  "Pakaian",
  "Makanan",
  "Furnitur",
  "Kendaraan",
  "Jasa",
  "Lainnya"
] as const

export const createMarketItemSchema = z.object({
  title: z
    .string()
    .min(3, 'Judul minimal 3 karakter')
    .max(100, 'Judul maksimal 100 karakter')
    .transform((v) => v.trim()),
  description: z
    .string()
    .max(2000, 'Deskripsi maksimal 2000 karakter')
    .transform((v) => v.trim())
    .optional(),
  price_idr: z
    .number()
    .min(0, 'Harga tidak boleh negatif'),
  category: z.string().default('Lainnya'),
  condition: z.enum(['Baru', 'Bekas', 'Seperti Baru']).default('Bekas'),
  location: z
    .string()
    .max(200, 'Lokasi maksimal 200 karakter')
    .transform((v) => v.trim())
    .optional(),
})

export type CreateMarketItemInput = z.infer<typeof createMarketItemSchema>
