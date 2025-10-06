// pages/giftcards/share/[id].tsx
import Head from "next/head";
import { GetServerSideProps } from "next";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

type Props = {
    ok: boolean;
    title: string;
    description: string;
    image: string;
    url: string;
};

export default function GiftcardSharePage({ ok, title, description, image, url }: Props) {
    const safeTitle = ok ? title : "Gift Card BOA";
    const safeDesc = ok ? description : "Regalos simples y con alma: café, arte y bienestar.";
    const safeImg = image || `${process.env.NEXT_PUBLIC_BASE_URL}/boa-og-fallback.png`;
    const canonical = url;

    return (
        <>
            <Head>
                <title>{safeTitle}</title>
                <meta name="description" content={safeDesc} />
                <meta property="og:type" content="website" />
                <meta property="og:title" content={safeTitle} />
                <meta property="og:description" content={safeDesc} />
                <meta property="og:image" content={safeImg} />
                <meta property="og:url" content={canonical} />
                <meta property="twitter:card" content="summary_large_image" />
                <meta property="twitter:title" content={safeTitle} />
                <meta property="twitter:description" content={safeDesc} />
                <meta property="twitter:image" content={safeImg} />
            </Head>

            {/* Pequeño redirect a la página pública de giftcards */}
            <main className="min-h-screen flex items-center justify-center">
                <div className="text-center p-6">
                    <p className="text-lg">Cargando giftcard…</p>
                    <p className="text-sm text-neutral-500">Si no redirige, <Link href="/giftcards" className="underline">hacé clic aquí</Link>.</p>
                </div>
            </main>

            <script
                dangerouslySetInnerHTML={{
                    __html: `setTimeout(function(){ window.location.href = "/giftcards"; }, 1200);`,
                }}
            />
        </>
    );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const id = String(ctx.params?.id || "");
    const url = `${process.env.NEXT_PUBLIC_BASE_URL}/giftcards/share/${id}`;

    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY! // server-side
    );
    const { data, error } = await supabase
        .from("giftcards")
        .select("name, description, image_url, value, is_active")
        .eq("id", id)
        .maybeSingle();

    if (error || !data) {
        return { props: { ok: false, title: "", description: "", image: "", url } };
    }

    const title = `${data.name} — $${Number(data.value || 0).toLocaleString("es-AR")}`;
    const description = data.description || "Gift Card BOA";
    const image = data.image_url || "";

    return { props: { ok: true, title, description, image, url } };
};
