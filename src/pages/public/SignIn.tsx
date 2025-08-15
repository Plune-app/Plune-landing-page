
import { SignInResponse } from "@/@types/user";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FormDescription, FormItem, FormLabel } from "@/components/ui/form";
import { FormWrapper } from "@/components/ui/FormWrapper";
import { FormInput } from "@/components/ui/FormInput";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { useUser } from "@/hooks/use-user";
import { useUserStore } from "@/store/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { memo, useCallback } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { AppAxiosError, useError } from "@/hooks/use-error";
import { UserDto, type UserSignInDTO } from "@/lib/DTO/user.dto";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
type KeyofUserSignInDTO = keyof UserSignInDTO

export const SignIn = memo(() => {
  const { signIn } = useUser();
  const navigate = useNavigate();
  const setUser = useUserStore(state => state.setUser);
  const treatErr = useError();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: signIn,
    mutationKey: ['user-signin'],
    onError: (err: AppAxiosError) => {
      treatErr(err)
    },
    onSuccess: (data: SignInResponse) => {
      if (data.statusCode == 200) {
        toast(data.message)
        setUser(data.payload.userCommonData);
        localStorage.setItem("@plune-app/token", data.payload.token);
        navigate("/")
      }
    },
    retry: 1,
  });
  const methods = useForm<UserSignInDTO>({
    resolver: zodResolver(UserDto.signIn)
  });
  const handleSubmitForm = useCallback(async (data: UserSignInDTO) => {
    return await mutateAsync(data);
  }, [])
  return (
    <Card>
      <CardHeader className="flex justify-between items-center">
         <main className="flex flex-col gap-2">
          <CardTitle>
            Login - Plune.app
          </CardTitle>
          <CardDescription>
          Signin to get start
          </CardDescription>
        </main>
        <aside>
          <Tooltip>
            <TooltipTrigger>
              <Button
                variant={"ghost"}
                size={"icon"}
                onClick={() => navigate("/")}
              >
                <ArrowLeft size={15} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              Go back to home
            </TooltipContent>
          </Tooltip>
        </aside>
      </CardHeader>
      <CardContent>
        <FormProvider {...methods}>
          <FormWrapper handleSubmitForm={handleSubmitForm}>
            <FormItem>
              <FormLabel htmlFor="e-mail">
                E-mail
              </FormLabel>
              <FormInput<KeyofUserSignInDTO> placeholder={"johndoe@acme.com"} id="e-mail" name="email" />
            </FormItem>
            <FormItem>
              <FormLabel htmlFor="password">
                Password
              </FormLabel>
              <FormInput<KeyofUserSignInDTO> placeholder={"******"} type={"password"} id="password" name="password" />
              <FormDescription>
                Dont tell your password to anyone
              </FormDescription>
            </FormItem>
            <SubmitButton isPending={isPending} title="Sign" />
          </FormWrapper>
        </FormProvider>
      </CardContent>
      <CardFooter>
        <Link to={"/signUp"} className="text-muted-foreground text-sm hover:underline hover:text-sidebar-accent-foreground">Doesn't have a account? Register now</Link>
      </CardFooter>
    </Card>
  )
})