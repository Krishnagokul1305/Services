import Link from "next/link";

function Logo() {
  return (
    <Link href="/" className="flex-shrink-0">
      <img src="/logo.png" alt="logo" />
    </Link>
  );
}

export default Logo;
