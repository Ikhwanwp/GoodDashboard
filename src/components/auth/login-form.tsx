
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/lib/firebase-config";
import { doc, getDoc, setDoc } from "firebase/firestore";

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
import { Loader2, Eye, EyeOff } from "lucide-react";
import type { User } from "@/lib/types";


const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

export function LoginForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const isFirebaseConfigured = !!auth;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!isFirebaseConfigured) {
        toast({
            variant: "destructive",
            title: "Konfigurasi Firebase Tidak Ditemukan",
            description: "Harap periksa konfigurasi Firebase Anda.",
        });
        return;
    }

    setIsLoading(true);

    // TEMPORARY: Admin creation backdoor logic
    // This allows creating the first admin if it doesn't exist.
    if (values.email === 'wiratama900@gmail.com' && values.password === 'ikhwan123') {
        try {
            // Only try to create if we're sure this is the first time
            // Checking if user exists in Firestore first would be better, but we try-catch the creation
            const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
            const user = userCredential.user;

            const userDocRef = doc(db, "users", user.uid);
            await setDoc(userDocRef, {
                nama: "Wiratama Admin",
                email: user.email,
                noHp: "",
                role: "Admin"
            });

            toast({
                title: "Admin Baru Berhasil Dibuat",
                description: "Silakan masuk ke sistem.",
            });
            router.push("/admin");
            setIsLoading(false);
            return;
        } catch (error: any) {
            // If already exists, just continue to normal sign-in below
            if (error.code !== 'auth/email-already-in-use') {
                console.warn("Backdoor attempt ignored or account already exists.");
            }
        }
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
      const user = userCredential.user;

      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data() as User;
        
        toast({
            title: "Login Berhasil",
            description: "Selamat datang kembali!",
        });

        // Redirect based on role
        if (userData.role === 'BA') {
            router.push("/dashboard-ba");
        } else if (userData.role === 'Admin') {
            router.push("/admin");
        } else {
            router.push("/dashboard");
        }
      } else {
          await signOut(auth);
          toast({
            variant: "destructive",
            title: "Data Pengguna Tidak Ditemukan",
            description: "Akun Anda belum terdaftar di database. Hubungi administrator.",
          });
      }

    } catch (error: any) {
      // Don't use console.error for expected authentication failures to avoid triggering dev overlays
      let errorMessage = "Terjadi kesalahan saat login.";
      const isCredentialError = ['auth/user-not-found', 'auth/wrong-password', 'auth/invalid-credential'].includes(error.code);
      
      if (isCredentialError) {
        errorMessage = 'Email atau password salah.';
      } else {
        console.error(`Unexpected Login Error:`, error);
        errorMessage = 'Login gagal. Silakan periksa kembali kredensial Anda.';
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
    <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-center">Masuk ke Sistem</CardTitle>
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
                    <Input placeholder="email@peruri.co.id" {...field} className="bg-white" disabled={!isFirebaseConfigured} />
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
                   <div className="relative">
                    <FormControl>
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="******"
                        {...field}
                        className="bg-white pr-10"
                        disabled={!isFirebaseConfigured}
                      />
                    </FormControl>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-primary"
                      disabled={!isFirebaseConfigured}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 font-bold" disabled={isLoading || !isFirebaseConfigured}>
              {isLoading ? <Loader2 className="animate-spin mr-2" /> : 'Masuk Sekarang'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
