import { LoginForm } from "@/components/auth/login-form";
import { Logo } from "@/components/icons";

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-[#fafafa] p-4 overflow-hidden">
      {/* Grid Background Pattern */}
      <div 
        className="absolute inset-0 z-0 opacity-40" 
        style={{
          backgroundImage: `
            linear-gradient(to right, #e5e5e5 1px, transparent 1px),
            linear-gradient(to bottom, #e5e5e5 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />
      
      {/* Decorative gradient for depth */}
      <div className="absolute inset-0 z-0 bg-gradient-to-tr from-white via-transparent to-transparent pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-8 flex flex-col items-center">
          <div className="flex items-center gap-2 mb-4">
            <Logo className="h-10 w-10 text-primary" />
            <h1 className="text-3xl font-bold text-primary tracking-tight">Govtech Dashboard</h1>
          </div>
          <p className="text-muted-foreground text-center font-medium">
            Monitoring Kontrak & Progres Pekerjaan
          </p>
        </div>
        <LoginForm />
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Gunakan akun yang telah terdaftar untuk masuk ke sistem.
        </p>
      </div>
    </div>
  );
}
