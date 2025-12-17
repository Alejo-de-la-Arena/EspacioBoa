import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
    return (
        <Html lang="en">
            <Head>
                {/* Favicon */}

                <link rel="icon" type="image/svg+xml" href="/images/logo-boa.svg" />

                {/* 
          CRITICAL: DO NOT REMOVE THIS SCRIPT
          The Softgen AI monitoring script is essential for core app functionality.
          The application will not function without it.
        */}
                <script
                    src="https://cdn.softgen.ai/script.js"
                    async
                    data-softgen-monitoring="true"
                />
            </Head>
            <body className="antialiased">
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
