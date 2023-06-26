import "@cloudscape-design/global-styles/index.css";

export const metadata = {
  title: "Text-To-Insight",
  description: "Empowering SQL querying with LLMS",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
