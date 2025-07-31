// Auto-generated types and parsers
import { z } from "zod";

export const v1_base_route_postReqSchema = z.object({})
export type v1_base_route_postReqSchemaType = z.infer<typeof v1_base_route_postReqSchema>;

export const v1_base_route_postResSchema = z.object({});
export type v1_base_route_postResSchemaType = z.infer<typeof v1_base_route_postResSchema>;

export const v1_base_route_getReqSchema = z.object({});
export type v1_base_route_getReqSchemaType = z.infer<typeof v1_base_route_getReqSchema>;

export const v1_base_route_getResSchema = z.object({});
export type v1_base_route_getResSchemaType = z.infer<typeof v1_base_route_getResSchema>;

export const v1_base_route_putReqSchema = z.object({});
export type v1_base_route_putReqSchemaType = z.infer<typeof v1_base_route_putReqSchema>;

export const v1_base_route_putResSchema = z.object({});
export type v1_base_route_putResSchemaType = z.infer<typeof v1_base_route_putResSchema>;

export const v1_base_route_deleteReqSchema = z.object({});
export type v1_base_route_deleteReqSchemaType = z.infer<typeof v1_base_route_deleteReqSchema>;

export const v1_base_route_deleteResSchema = z.object({});
export type v1_base_route_deleteResSchemaType = z.infer<typeof v1_base_route_deleteResSchema>;

export const v1_base_route_patchReqSchema = z.object({});
export type v1_base_route_patchReqSchemaType = z.infer<typeof v1_base_route_patchReqSchema>;

export const v1_base_route_patchResSchema = z.object({});
export type v1_base_route_patchResSchemaType = z.infer<typeof v1_base_route_patchResSchema>;

export const v1_user_login_postReqSchema = z.object({
    email: z.email(),
    password: z.string().min(6),
});
export type v1_user_login_postReqSchemaType = z.infer<typeof v1_user_login_postReqSchema>;

export const v1_user_login_postResSchema = z.object({
    user: z.object({
        id: z.string(),
        email: z.email(),
        name: z.string().optional(),
    }),
});
export type v1_user_login_postResSchemaType = z.infer<typeof v1_user_login_postResSchema>;

export const v1_user_logout_postReqSchema = z.object({
    email: z.email(),
    password: z.string().min(6),
});
export type v1_user_logout_postReqSchemaType = z.infer<typeof v1_user_logout_postReqSchema>;

export const v1_user_logout_postResSchema = z.object({
    message: z.string(),
});
export type v1_user_logout_postResSchemaType = z.infer<typeof v1_user_logout_postResSchema>;

