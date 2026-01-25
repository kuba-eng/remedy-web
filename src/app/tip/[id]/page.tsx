
import { Metadata } from "next";
import { REMEDY_TIPS } from "@/data/remedy-tips";
import { HomeContent } from "@/components/home/HomeContent";

interface Props {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    const tip = REMEDY_TIPS.find((t) => t.id === id);

    if (!tip) {
        return {
            title: "Tip nenalezen | REMEDY",
        };
    }

    const title = `💡 Tip: ${tip.headline} | REMEDY`;
    const description = tip.body;
    const ogImage = `https://remedy.cz/api/og?id=${tip.id}`;

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            images: [
                {
                    url: ogImage,
                    width: 1200,
                    height: 630,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [ogImage],
        },
    };
}

export default async function TipPage({ params }: Props) {
    const { id } = await params;
    return <HomeContent initialTipId={id} />;
}
