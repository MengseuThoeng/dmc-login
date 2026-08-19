import "./globals.css";
import localFont from "next/font/local";

const roboto = localFont({
    src: [
        {
            path: "../fonts/Roboto/Roboto-VariableFont_wdth,wght.ttf",
            style: "normal",
        },
    ],
    variable: "--font-roboto",
    display: "swap",
});

const siemreap = localFont({
    src: [
        {
            path: "../fonts/Siemreap/Siemreap-Regular.ttf",
            style: "normal",
        },
    ],
    variable: "--font-siemreap",
    weight: "400",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${roboto.variable} ${siemreap.variable} m-0 p-0`}
      >
        {children}
      </body>
    </html>
  );
}
