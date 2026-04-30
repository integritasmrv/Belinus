import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Belinus — Advanced Battery Storage',
  description: "Belgium's lithium-free commercial battery storage. Graphene supercapacitor technology with 99% round-trip efficiency and a 35-year warranty.",
  openGraph: {
    title: 'Belinus — Advanced Battery Storage',
    description: "Belgium's lithium-free commercial battery storage.",
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
