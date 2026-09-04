import "normalize.css";
import "../core/providers/HtmlLayoutWrapper/globals.scss";
import { SITE_URL } from "@/shared/seo";

export const metadata = {
    metadataBase: new URL(SITE_URL),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return children;
}
