import Link from "next/link";

export default function Home() {
  return (
    <>
      <div className="flex bg-red-500 text-3xl bg-center">
        Welcome to welcome page
      </div>
      <h1>
        <Link href={"login"}>Login Page</Link>
      </h1>
      <h1>
        <Link href={"products"}>product Page</Link>
      </h1>
    </>
  );
}
