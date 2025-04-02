"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import Link from "next/link"
import { toast, Toaster } from "sonner"
import FormField from "./FormField"
import { useRouter } from "next/navigation"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "@/firebase/client"
import { signIn, signUp } from "@/lib/actions/auth.action"


export type FormType = "signin" | "signup"

const AuthFormSchema =(type: FormType) => {
  return z.object({
    name: type === "signup" ? z.string().min(3) : z.string().optional(),
    email: z.string().email(),
    password: z.string().min(6),
  })
}

function authForm({type}:{type:FormType}) {

  const router = useRouter();

  const formSchema = AuthFormSchema(type);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          name: type === "signup" ? "" : undefined, // Only provide name when signing up
          email: "",
          password: "",
        }
        ,
      })
     
      // 2. Define a submit handler.
      async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
          if (type === "signup") {
            const { name, email, password } = values;
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const result = await signUp({
              uid: userCredential.user.uid,
              name:name!,
              email,
              password
            })

            if(!result?.success){
              toast.error(result?.message!)
            }

            toast.success("Sign Up successfully");
            router.push("/signin")
          } else {
            const { email, password } = values;
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const idToken = await userCredential.user.getIdToken();

            if(!idToken) {
              toast.error("Something went wrong, please try again later")
              return;
            }

            await signIn({
              email,
              idToken,
            })
            toast.success("Sign In successfully");
            router.push("/")
          }
          console.log(values);
        } catch (error) {
          console.log(values);
          toast.error("Something went wrong " + error);
        }
      } // <-- Add this missing closing brace
      
      const isSignin = type === "signin";
      
  return (
    <div className="card-border lg:min-w-[566px]">
        <div className="flex flex-col gap-6 card py-14 px-10">
            <div className="flex flex-row gap-2 justify-center">
                <Image src="/logo.svg" alt="logo" width={32} height={38} className="object-cover" />
                <h1 className="text-primary-100">HireReady</h1>
            </div>
            <h3 className="text-primary-100">Get Ready for job Interview with HireReady</h3>
        <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6 mt-4 form">
      {!isSignin && (
  <FormField control={form.control} name="name" label="Name" placeholder="Your Name" />
)}

<FormField control={form.control} name="email" label="Email" placeholder="Enter your email" type="email" />
<FormField control={form.control} name="password" label="Password" placeholder="Enter your password" type="password" />
        <Button className="btn" type="submit">{isSignin ? "Sign In" : "Create an Account"}</Button>
      </form>
    </Form>
    <p className="text-center">
      {isSignin ? "Don't have an account?" : "Already have an account?"}
      <Link href={!isSignin ? "/signin" : "/signup"} className="text-primary-100 font-bold ml-1">
      {isSignin ? "Sign Up" : "Sign In"}
      </Link>
     
    </p>
    </div>
    </div>

  )
}

export default authForm;