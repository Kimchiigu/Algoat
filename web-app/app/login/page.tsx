"use client";

import { useEffect, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import * as THREE from "three"; // Importing three.js
import HALO from "vanta/dist/vanta.halo.min"; // Importing Vanta.js Halo effect

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

const LoginSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

export default function LoginForm() {
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const vantaRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const vantaEffect = HALO({
      el: vantaRef.current!,
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200.0,
      minWidth: 200.0,
      THREE,
    });

    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, []);

  function onSubmit(data: z.infer<typeof LoginSchema>) {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  return (
    <div
      ref={vantaRef}
      className="w-full min-h-screen flex flex-col items-center justify-center"
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full min-h-screen space-y-6 flex flex-col items-center justify-center"
        >
          <div
            className="flex flex-col rounded-md py-16 px-12 shadow-xl bg-white bg-opacity-50"
            style={{
              backdropFilter: "blur(16px)",
              backgroundColor: "rgba(255, 255, 255, 0.25)",
              boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
              borderRadius: "16px",
              border: "1px solid rgba(255, 255, 255, 0.18)",
            }}
          >
            <h2 className="scroll-m-20 border-b pb-2 text-3xl mb-4 font-semibold tracking-tight first:mt-0 text-gray-100">
              Login Algoaters!
            </h2>

            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem className="mb-5">
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Username"
                      {...field}
                      style={{
                        backdropFilter: "blur(16px)",
                        backgroundColor: "rgba(255, 255, 255, 0.25)",
                        boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
                        borderRadius: "7px",
                        border: "1px solid rgba(255, 255, 255, 0.18)",
                      }}
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
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Password"
                      {...field}
                      style={{
                        backdropFilter: "blur(16px)",
                        backgroundColor: "rgba(255, 255, 255, 0.25)",
                        boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
                        borderRadius: "7px",
                        border: "1px solid rgba(255, 255, 255, 0.18)",
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Login</Button>
            <p className="mt-4 text-sm text-center">
              Don't have an account?{" "}
              <a href="/register" className="text-gray-100 hover:underline">
                Register
              </a>
            </p>
          </div>
        </form>
      </Form>
    </div>
  );
}
