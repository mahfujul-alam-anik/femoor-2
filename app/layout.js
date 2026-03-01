import './globals.css';
import { Toaster } from 'sonner';

export const metadata = {
  title: 'Modern Admin Panel',
  description: 'Products, orders and business statistics dashboard'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body>
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
