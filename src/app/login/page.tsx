import { LoginForm } from "@/components/auth/login-form";
import { Logo } from "@/components/icons";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center">
          <div className="flex items-center gap-2 mb-4">
            <Logo className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-primary">K/L Monitor</h1>
          </div>
          <p className="text-muted-foreground text-center">
            Monitoring Kontrak & Progres Pekerjaan
          </p>
        </div>
        <LoginForm />
        <p className="mt-4 text-center text-sm text-muted-foreground">
          Gunakan akun yang telah terdaftar untuk masuk.
        </p>
      </div>
    </div>
  );
}
