
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/lib/firebase-config";
import { doc, getDoc } from "firebase/firestore";

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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import type { User } from "@/lib/types";


const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

export function LoginForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
      const user = userCredential.user;

      // Fetch user role from Firestore
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data() as User;
        
        toast({
            title: "Login Berhasil",
            description: "Anda akan diarahkan ke dashboard.",
        });

        // Redirect based on role
        if (userData.role === 'BA') {
            router.push("/dashboard-ba");
        } else {
            router.push("/dashboard"); // Default for GA, Admin, Viewer
        }
      } else {
          throw new Error("User data not found in database.");
      }

    } catch (error: any) {
      console.error("Login Error:", error);
      let errorMessage = "Terjadi kesalahan saat login.";
      switch (error.code) {
        case 'auth/user-not-found':
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
           errorMessage = 'Email atau password salah.';
           break;
        case 'auth/invalid-api-key':
        case 'auth/api-key-not-valid.': 
           errorMessage = 'Kunci API Firebase tidak valid. Pastikan konfigurasi sudah benar.';
           break;
        case 'auth/configuration-not-found':
            errorMessage = 'Konfigurasi Firebase tidak ditemukan. Periksa file .env.local Anda.';
            break;
        default:
          errorMessage = 'Login gagal. Silakan coba lagi.';
          break;
      }
      toast({
        variant: "destructive",
        title: "Login Gagal",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Login</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="email@peruri.co.id" {...field} className="placeholder:text-muted-foreground/40" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Password" {...field} className="placeholder:text-muted-foreground/40" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full bg-accent hover:bg-accent/90" disabled={isLoading}>
              {isLoading ? <Loader2 className="animate-spin" /> : 'Masuk'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
