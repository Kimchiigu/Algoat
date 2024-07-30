"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import Particles from "react-tsparticles";
import type { Engine } from "tsparticles-engine";
import { loadStarsPreset } from "tsparticles-preset-stars";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { useCallback } from "react";
import { handleRegister } from "@/controller/user-controller";
import { useRouter } from "next/navigation";
import withAuth from "@/hoc/withAuth";

const RegisterSchema = z
  .object({
    email: z.string().email({
      message: "Invalid email address.",
    }),
    username: z.string().min(2, {
      message: "Username must be at least 2 characters.",
    }),
    password: z.string().min(6, {
      message: "Password must be at least 6 characters.",
    }),
    confirmPassword: z.string().min(6, {
      message: "Confirm password must be at least 6 characters.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ["confirmPassword"],
  });

function RegisterPage() {
  const router = useRouter();
  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof RegisterSchema>) => {
    try {
      await handleRegister(data.email, data.password, data.username);
      router.push("/home");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";

      toast({
        title: "Register failed",
        description: errorMessage,
      });
    }
  };

  const particlesInit = useCallback(async (engine: Engine) => {
    await loadStarsPreset(engine);
  }, []);

  const particlesOptions = {
    preset: "stars",
    background: {
      color: {
        value: "#000",
      },
    },
    particles: {
      move: {
        speed: 1,
      },
    },
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center">
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={particlesOptions}
      />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full min-h-screen flex flex-col items-center justify-center p-4"
        >
          <div
            className="flex flex-col rounded-md py-16 px-12 shadow-xl"
            style={{
              backdropFilter: "blur(1px)",
              backgroundColor: "rgba(255, 255, 255, 0.25)",
              boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
              borderRadius: "16px",
              border: "1px solid rgba(255, 255, 255, 0.18)",
            }}
          >
            <h2 className="scroll-m-20 border-b border-primary pb-2 text-3xl mb-4 font-semibold tracking-tight text-primary">
              Register with Algoaters!
            </h2>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="mb-5">
                  <FormLabel className="text-primary">Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Email"
                      {...field}
                      className="bg-card text-card-foreground placeholder:text-muted-foreground"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem className="mb-5">
                  <FormLabel className="text-primary">Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Username"
                      {...field}
                      className="bg-card text-card-foreground placeholder:text-muted-foreground"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="mb-5">
                  <FormLabel className="text-primary">Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Password"
                      {...field}
                      className="bg-card text-card-foreground placeholder:text-muted-foreground"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem className="mb-5">
                  <FormLabel className="text-primary">
                    Confirm Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Confirm Password"
                      {...field}
                      className="bg-card text-card-foreground placeholder:text-muted-foreground"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="bg-primary text-primary-foreground"
            >
              Register
            </Button>
            <p className="mt-4 text-sm text-center text-primary">
              Already have an account?{" "}
              <a href="/login" className="text-primary hover:underline">
                Login
              </a>
            </p>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default withAuth(RegisterPage, false);
