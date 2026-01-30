import LoginForm from "@/components/auth/login-form";
import Image from "next/image";

const Login = () => {
  return (
    <div className="min-h-screen w-full lg:grid lg:grid-cols-2">
      <div className="flex items-center justify-center p-8 bg-background">
        <LoginForm />
      </div>
      <div className="hidden lg:flex flex-col items-center justify-center bg-muted/30 p-8 text-foreground relative overflow-hidden border-l border-border">
        {/* Abstract Background Elements */}
        {/* eslint-disable-next-line tailwindcss/no-custom-classname */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-primary/20 via-background to-background" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light" />

        <div className="relative z-10 flex flex-col items-center gap-12">
          {/* Logos */}
          <div className="relative w-48 h-auto">
            <Image
              src="/logo-en.webp"
              alt="Esnaad"
              width={192}
              height={64}
              className="w-full h-auto object-contain drop-shadow-2xl"
            />
          </div>
          <div className="relative w-48 h-auto opacity-80">
            <Image
              src="/logo-ar.svg"
              alt="Esnaad Arabic"
              width={192}
              height={64}
              className="w-full h-auto object-contain drop-shadow-xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
