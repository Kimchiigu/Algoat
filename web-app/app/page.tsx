"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { z } from "zod";
import Particles from "react-tsparticles";
import type { Engine } from "tsparticles-engine";
import { loadStarsPreset } from "tsparticles-preset-stars";
import { Button } from "@/components/ui/button";
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
import { handleLogin } from "@/controller/user-controller";
import withAuth from "@/hoc/withAuth";

const LoginSchema = z.object({
  email: z.string().min(1, {
    message: "Email cannot be empty",
  }),
  password: z.string().min(1, {
    message: "Password cannot be empty",
  }),
});

function LoginPage() {
  const router = useRouter();
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof LoginSchema>) => {
    try {
      await handleLogin(data.email, data.password);
      router.push("/home");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";

      toast({
        title: "Login failed",
        description: errorMessage,
        duration: 5000,
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
              Login Algoaters!
            </h2>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="mb-5">
                  <FormLabel className="text-primary">Email</FormLabel>
                  <FormControl>
                    <Input
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
            <Button className="bg-primary text-primary-foreground">
              Login
            </Button>
            <p className="mt-4 text-sm text-center text-primary">
              Don't have an account?{" "}
              <a href="/register" className="hover:underline text-primary">
                Register
              </a>
            </p>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default withAuth(LoginPage, false);
