export default function PrivacyPage() {
    return (
        <div className="container mx-auto py-10">
            <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
            <div className="prose dark:prose-invert">
                <p>Last updated: {new Date().toLocaleDateString()}</p>
                <p>
                    Your privacy is important to us. It is our policy to respect your privacy regarding any information we may collect from you across our website.
                </p>
                <h2>1. Information We Collect</h2>
                <p>
                    We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent.
                </p>
                {/* Add more sections as needed */}
            </div>
        </div>
    );
}
