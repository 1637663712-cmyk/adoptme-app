import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(1, "请输入姓名").max(50),
  email: z.string().email("请输入有效的邮箱"),
  password: z.string().min(6, "密码至少6位").max(100),
});

export const loginSchema = z.object({
  email: z.string().email("请输入有效的邮箱"),
  password: z.string().min(1, "请输入密码"),
});

export const petSchema = z.object({
  title: z.string().min(1, "请输入标题").max(100),
  species: z.enum(["DOG", "CAT", "OTHER"]),
  breed: z.string().optional(),
  age: z.string().optional(),
  gender: z.string().optional(),
  size: z.enum(["SMALL", "MEDIUM", "LARGE"]).optional(),
  color: z.string().optional(),
  location: z.string().min(1, "请填写所在城市"),
  description: z.string().min(10, "描述至少10个字").max(2000),
  photos: z.array(z.string()).default([]),
  contactName: z.string().optional(),
  contactPhone: z.string().optional(),
  contactWechat: z.string().optional(),
});

export const applicationSchema = z.object({
  message: z.string().min(10, "申请信息至少10个字").max(500),
});

export const petSearchSchema = z.object({
  query: z.string().optional(),
  species: z.enum(["DOG", "CAT", "OTHER"]).optional(),
  size: z.enum(["SMALL", "MEDIUM", "LARGE"]).optional(),
  location: z.string().optional(),
  source: z.enum(["USER_POSTED", "SCRAPED"]).optional(),
  status: z.enum(["AVAILABLE", "PENDING", "ADOPTED"]).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
  sort: z.enum(["newest", "oldest", "views"]).default("newest"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type PetInput = z.infer<typeof petSchema>;
export type ApplicationInput = z.infer<typeof applicationSchema>;
export type PetSearchInput = z.infer<typeof petSearchSchema>;
