import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <AuthProvider>
        <Navbar />
        <body>{children}</body>
      </AuthProvider>
    </html>
  );
}
