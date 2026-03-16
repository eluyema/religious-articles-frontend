import "normalize.css";
import "../core/providers/HtmlLayoutWrapper/globals.scss";
import { baseUrl } from "@/shared/config/baseUrl";

export const metadata = {
    metadataBase: new URL(baseUrl),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return children;
}
