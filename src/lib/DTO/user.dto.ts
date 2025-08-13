import z from "zod";

export class UserDto {
  static userOrganization = z.object({})
  static signUp = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string().min(2).max(30),
    avatar: z.any().optional(),
  });

  static signIn = z.object({
    email: z.string().email({ message : "Its necessary a correct e-mail"}),
    password: z.string().min(6, "too short pass")
  });
  static update = z.object({
    name: z.string().min(2).max(30).optional(),
    email: z.string().email().optional(),
    avatar: z.any().optional(),
    currentPassword: z.string().min(6).optional(),
    newPassword: z.string().min(6).optional()
  })
}

export type UserSignInDTO = z.infer<typeof UserDto.signIn>
export type UserSignUpDTO = z.infer<typeof UserDto.signUp>