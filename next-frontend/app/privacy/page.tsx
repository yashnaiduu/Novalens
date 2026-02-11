export default function PrivacyPage() {
    return (
        <main className="container mx-auto px-6 py-24 min-h-screen">
            <div className="max-w-3xl mx-auto prose prose-invert prose-lg">
                <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
                <p className="text-muted-foreground mb-8">Last updated: February 10, 2026</p>

                <section className="space-y-6 text-muted-foreground">
                    <p>
                        Your privacy is important to us. It is BG Remover&apos;s policy to respect your privacy regarding any information we may collect from you across our website.
                    </p>

                    <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">1. Information We Collect</h2>
                    <p>
                        We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent. We also let you know why we’re collecting it and how it will be used.
                    </p>
                    <p>
                        For image processing, images are uploaded to our secure servers, processed, and then returned to you. <strong>We do not store your images permanently.</strong> All uploaded files are automatically deleted after 1 hour.
                    </p>

                    <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">2. Use of Information</h2>
                    <p>
                        We define the processing of images strictly for the purpose of removing backgrounds. We do not use your images to train our AI models without your explicit consent.
                    </p>

                    <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">3. Data Retention</h2>
                    <p>
                        We overwrite data to prevent unauthorized access, disclosure, copying, use, or modification. We don’t share any personally identifying information publicly or with third-parties, except when required to by law.
                    </p>

                    <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">4. Your Rights</h2>
                    <p>
                        You are free to refuse our request for your personal information, with the understanding that we may be unable to provide you with some of your desired services.
                    </p>

                    <p className="pt-8 border-t border-white/10 mt-12">
                        If you have any questions about how we handle user data and personal information, feel free to contact us.
                    </p>
                </section>
            </div>
        </main>
    );
}
