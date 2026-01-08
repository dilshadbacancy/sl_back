import { z } from "zod"
import { AdminRole } from "../../utils/enum.utils"

export const CreateAdminSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.email("Invalid email address"),
    mobile: z.string().min(10, "Mobile number must be at least 10 digits"),
    role: z.enum(AdminRole),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(
            /[!@#$%^&*(),.?":{}|<>]/,
            "Password must contain at least one special character"
        ),
})



export const AdminLoginSchema = z.object({
    email: z.email(),
    password: z.string().min(8),
})


export const ChangeAdminPassowrdSchema = z
    .object({
        id: z.string("User id is required"),
        currentPassword: z
            .string()
            .min(8, "Current password must be at least 8 characters"),

        newPassword: z
            .string()
            .min(8, "New password must be at least 8 characters")
            .regex(
                /^(?=.*[!@#$%^&*(),.?":{}|<>])/,
                "New password must include at least one special character"
            ),

        confirmPassword: z.string(),
    })

    // ✅ new & confirm must match
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "New password and confirm password must match",
        path: ["confirmPassword"],
    })

    // ✅ new password must NOT be same as current
    .refine((data) => data.newPassword !== data.currentPassword, {
        message: "New password must be different from current password",
        path: ["newPassword"],
    });
