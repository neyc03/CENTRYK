import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Centryx MDM — Plataforma de Monitoreo & Control Android',
  description: 'Gestión de dispositivos corporativos Android, Índice de Foco y Monitoreo en Tiempo Real',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="bg-[#050A14] text-white antialiased">
        {children}
      </body>
    </html>
  );
}
