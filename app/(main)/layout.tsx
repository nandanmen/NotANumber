import { BackgroundStripes } from "~/components/stripe-pattern";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Not a Number",
    description:
        "An interactive blog on computer science and web development, by Nanda Syahrasyad.",
    authors: [
        {
            name: "Nanda Syahrasyad",
            url: "https://twitter.com/nandafyi",
        },
    ],
    twitter: {
        card: "summary_large_image",
        title: "Not a Number",
        description:
            "An interactive blog on computer science and web development, by Nanda Syahrasyad.",
        creator: "@nandafyi",
    },
    openGraph: {
        title: "Not a Number",
        description:
            "An interactive blog on computer science and web development, by Nanda Syahrasyad.",
        url: "https://nan.fyi",
        siteName: "Not a Number",
    },
    metadataBase: new URL("https://nan.fyi"),
};

export default function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen flex isolate">
            <BackgroundStripes className="fixed inset-0" />
            <div
                className="relative mx-auto px-4 max-w-[1450px] w-full"
            >
                <div className="bg-gray4 border-x border-gray8">
                    {children}
                </div>
            </div>
        </div>
    )
}