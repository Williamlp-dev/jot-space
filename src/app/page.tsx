import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Se estiver logado, redireciona para a aplicação de notas
  if (session) {
    redirect("/notes");
  }

  // Se não estiver logado, mostra a landing page
  return (
    <div className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
      <div className="relative z-10 text-center max-w-3xl">
        <Badge
          variant="secondary"
          className="rounded-full py-1 border-border"
          asChild
        >
          <Link href="#">
            Just released v1.0.0 <ArrowUpRight className="ml-1 size-4" />
          </Link>
        </Badge>
        <h1 className="mt-6 text-4xl sm:text-5xl md:text-6xl lg:text-7xl md:leading-[1.2] font-semibold tracking-tighter">
          Notes.
        </h1>
        <p className="mt-6 md:text-lg">
          Organize your thoughts, capture your ideas, and stay productive with our intuitive note-taking app. 
          Create, edit, and manage your notes effortlessly with a clean, distraction-free interface designed for modern productivity.
        </p>
        <div className="mt-12 flex items-center justify-center gap-4">
          <Link href="/signin">
          <Button size="lg" className="rounded-full text-base">
            Sign In <ArrowUpRight className="h-5! w-5!" />
          </Button>
          </Link>
          <Link href="/signup">
          <Button size="lg" className="rounded-full text-base">
            Sign Up <ArrowUpRight className="h-5! w-5!" />
          </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
