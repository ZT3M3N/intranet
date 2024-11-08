"use client";
import Link from "next/link";
import Image from "next/image";
import { signIn, useSession, signOut } from "next-auth/react";

const Navbar = () => {
  const { data: session } = useSession();

  return (
    <nav className="bg-slate-900 flex items-center py-3 justify-between px-24 text-white">
      <Link href="/">
        <h1>NextGoogle</h1>
      </Link>

      {session?.user ? (
        <div className="flex gap-2 items-center">
          <Link href="/login">Guest dashboard</Link>
          <p>
            {session.user.name}
            {session.user.email}
          </p>
          <Image
            src={session.user.image}
            alt="User IMG"
            className="w-10 h-10 rounded-full cursor-pointer"
          />
          <button
            onClick={async () => {
              await signOut({
                callbackUrl: "/login",
              });
            }}
          >
            Cerrar Sesión
          </button>
        </div>
      ) : (
        <button
          onClick={() => signIn()}
          className="bg-sky-400 px-3 py-2 rounded"
        >
          Iniciar sesión
        </button>
      )}
    </nav>
  );
};

export default Navbar;
