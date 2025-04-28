import { BackgroundStripes } from "~/components/stripe-pattern";

export default function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen flex">
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