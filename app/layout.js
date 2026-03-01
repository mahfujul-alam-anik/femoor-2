import './globals.css';
import { Toaster } from 'sonner';

export const metadata = {
  title: 'Admin Panel',
  description: 'Products, orders and business statistics'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
