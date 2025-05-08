import Link from "next/link";
import Image from "next/image";

interface UserMetadata {
  name?: string;
  avatar_url?: string;
}

interface User {
  user_metadata: UserMetadata;
}

export default function ButtonProfile({ user }: { user: User }) {
  const name = user?.user_metadata?.name || "Perfil";
  // const avatar = user?.user_metadata?.avatar_url || "/default-avatar.png";

  return (
    <Link href="/perfil">
      <div className="flex items-center gap-2 cursor-pointer px-3 py-2 rounded hover:bg-gray-100 transition-colors">
        <Image
          src="/javier-milei.jpg"
          alt="Avatar del usuario"
          width={38}
          height={32}
          className="rounded-full"
        />
        <span className="text-m font-medium text-gray-800">{name}</span>
      </div>
    </Link>
  );
}
