import Link from "next/link";

const TABLE_OF_CONTENTS = [
  { id: "introduction", label: "Introduction" },
  { id: "personal-data", label: "1. Personal data we collect" },
  { id: "telemetry", label: "2. Telemetry data" },
  { id: "how-we-use", label: "3. How we use personal data" },
  { id: "how-we-share", label: "4. How we share personal data" },
  { id: "retention", label: "5. Retention" },
  { id: "security", label: "6. Security" },
  { id: "your-rights", label: "7. Your rights and choices" },
  { id: "jurisdiction", label: "8. Jurisdiction-specific disclosures" },
  { id: "changes", label: "9. Privacy policy changes" },
  { id: "contact", label: "10. Contacting us" },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative px-6 py-16 md:py-24">
        <div className="relative mx-auto max-w-4xl">
          <div className="mb-4 flex items-center gap-4 text-sm text-fg-muted">
            <Link href="/terms" className="hover:text-fg-primary transition-colors">
              Terms of Service
            </Link>
            <span className="text-border-default">|</span>
            <span className="text-pink">Privacy Policy</span>
          </div>
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-fg-primary md:text-5xl">
            Privacy Policy
          </h1>
          <p className="mt-4 text-fg-muted">Last updated January 3, 2026</p>
        </div>
      </section>

      {/* Content */}
      <section className="px-6 pb-24">
        <div className="mx-auto max-w-4xl">
          <div className="grid gap-12 lg:grid-cols-[240px_1fr]">
            {/* Table of Contents - Desktop */}
            <aside className="hidden lg:block">
              <div className="sticky top-24">
                <h3 className="mb-4 font-mono text-xs uppercase tracking-wider text-fg-muted">
                  Contents
                </h3>
                <nav className="space-y-2">
                  {TABLE_OF_CONTENTS.map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className="block text-sm text-fg-secondary hover:text-fg-primary transition-colors"
                    >
                      {item.label}
                    </a>
                  ))}
                </nav>
              </div>
            </aside>

            {/* Main Content */}
            <div className="prose-custom">
              {/* Introduction */}
              <section id="introduction" className="scroll-mt-24">
                <h2 className="mb-6 text-2xl font-bold text-fg-primary">Introduction</h2>
                <div className="space-y-4 text-fg-secondary">
                  <p>
                    We at This Company, Inc. (&ldquo;<strong className="text-fg-primary">This Company</strong>&rdquo;, 
                    &ldquo;<strong className="text-fg-primary">we</strong>&rdquo; or 
                    &ldquo;<strong className="text-fg-primary">us</strong>&rdquo;) are strongly committed to 
                    respecting your privacy and keeping secure any information you share with us. This privacy 
                    policy (&ldquo;<strong className="text-fg-primary">Privacy Policy</strong>&rdquo;) explains 
                    how we collect, use, disclose, and process your personal data when you use This Company&apos;s 
                    software, platform, APIs, documentation, and related tools, including at the website at
                    waitlist.example.com, and all related software made available by This Company to build, deploy, and
                    manage software projects (&ldquo;<strong className="text-fg-primary">Service</strong>&rdquo;).
                    It also tells you how you can access and update your personal information and describes the 
                    data protection rights that may be available under your country&apos;s or state&apos;s laws.
                  </p>
                  <p>
                    Please read this Privacy Policy carefully. By accessing or using the Service, you acknowledge 
                    you have been informed of and consent to our practices with regard to your personal information 
                    and data.
                  </p>
                  <p>
                    Please note that this Privacy Policy does not apply where This Company acts as a data processor 
                    and processes personal data on behalf of commercial customers using our commercial services, 
                    for example, if your employer has provisioned a Amazing App account for you to use at work. Our 
                    use of that data is governed by our customer agreements covering access to and use of those 
                    offerings.
                  </p>
                </div>
              </section>

              {/* 1. Personal data we collect */}
              <section id="personal-data" className="mt-16 scroll-mt-24">
                <h2 className="mb-6 text-2xl font-bold text-fg-primary">1. Personal data we collect</h2>
                <div className="space-y-6 text-fg-secondary">
                  <p>We collect the following categories of personal data:</p>
                  
                  <div>
                    <h3 className="mb-3 text-lg font-semibold text-fg-primary">
                      A. Personal data you provide to us directly
                    </h3>
                    <p className="mb-4">
                      We collect personal data if you create an account to use our Service or communicate with us. 
                      This includes:
                    </p>
                    <ul className="list-disc space-y-3 pl-6">
                      <li>
                        <strong className="text-fg-primary">Account Information:</strong> This Company collects 
                        identifiers, such as your name and email address, when you sign up for a This Company 
                        account or to receive information about our Service.
                      </li>
                      <li>
                        <strong className="text-fg-primary">Payment Information:</strong> We collect your payment 
                        information if you seek to access any paid This Company products and services.
                      </li>
                      <li>
                        <strong className="text-fg-primary">Inputs and Suggestions:</strong> The Service allows 
                        you to submit content (&ldquo;Inputs&rdquo;), which generate responses 
                        (&ldquo;Suggestions&rdquo;) based on your Inputs. If you include personal data or 
                        reference external content in your Inputs, we will collect that information and it may 
                        be reproduced in the Suggestions we provide.
                      </li>
                      <li>
                        <strong className="text-fg-primary">Communication Information:</strong> If you communicate 
                        with us, we collect your name, contact information, and the contents of any messages you send.
                      </li>
                      <li>
                        <strong className="text-fg-primary">Feedback:</strong> While using the Service, you may 
                        provide feedback, including ideas and suggestions for improvement or rating a Suggestion 
                        in response to an Input (&ldquo;Feedback&rdquo;). If you provide Feedback on the Service, 
                        we may store the entire exchange as part of your Feedback.
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="mb-3 text-lg font-semibold text-fg-primary">
                      B. Personal data we receive from your use of the Service
                    </h3>
                    <p className="mb-4">
                      When you use the Service, we also receive certain technical data automatically. This includes:
                    </p>
                    <ul className="list-disc space-y-3 pl-6">
                      <li>
                        <strong className="text-fg-primary">Device Information:</strong> Your device or browser 
                        automatically sends us information about when and how you install, access, or use our 
                        Service. This information may include your device type, browser information, operating 
                        system information, and mobile network or ISP.
                      </li>
                      <li>
                        <strong className="text-fg-primary">Log Information:</strong> We collect information about 
                        how our Service is performing, including your IP address, browser type and settings, error 
                        logs, and other ways that you interact with the Service.
                      </li>
                      <li>
                        <strong className="text-fg-primary">Usage Data:</strong> We collect information about your 
                        use of the Service, such as the dates and times of access, browsing history, search, 
                        information about the links you click, pages you view, and other information about how 
                        you use the Service.
                      </li>
                      <li>
                        <strong className="text-fg-primary">Cookies &amp; Similar Technologies:</strong> We and our 
                        service providers utilize cookies, pixels, scripts, or similar technologies to operate and 
                        manage the Service and improve your experience.
                      </li>
                      <li>
                        <strong className="text-fg-primary">Location Information:</strong> For security and performance 
                        reasons, we may determine the geographic location from which your device accesses our Service 
                        using information such as your IP address.
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="mb-3 text-lg font-semibold text-fg-primary">
                      C. Information we do not collect
                    </h3>
                    <p>
                      This Company does not knowingly collect sensitive or special category personal information, 
                      such as genetic data, biometric data for the purposes of uniquely identifying a natural person, 
                      health information, or religious information. Additionally, This Company does not knowingly 
                      collect information from or direct any of our Service or content to children under the age of 18.
                    </p>
                  </div>
                </div>
              </section>

              {/* 2. Telemetry data */}
              <section id="telemetry" className="mt-16 scroll-mt-24">
                <h2 className="mb-6 text-2xl font-bold text-fg-primary">2. Telemetry data</h2>
                <div className="space-y-4 text-fg-secondary">
                  <p>
                    Amazing App includes an optional telemetry system designed to improve performance 
                    recommendations and help us understand how the application is used.{" "}
                    <strong className="text-fg-primary">Telemetry is disabled by default</strong> and 
                    must be explicitly enabled by the user.
                  </p>
                  <p>
                    All collected telemetry data is anonymized and contains no personally identifiable 
                    information (PII), file contents, code, prompts, or API keys.
                  </p>
                  
                  <div className="mt-6">
                    <h3 className="mb-3 text-lg font-semibold text-fg-primary">Telemetry levels</h3>
                    <ul className="list-disc space-y-2 pl-6">
                      <li>
                        <strong className="text-fg-primary">Off (Default):</strong> No data is collected or stored.
                      </li>
                      <li>
                        <strong className="text-fg-primary">Local Only:</strong> Data is collected and stored 
                        locally on your device. Data is never uploaded to our servers.
                      </li>
                      <li>
                        <strong className="text-fg-primary">Anonymous:</strong> Aggregated, anonymized statistics 
                        are uploaded to help improve Amazing App. No individual usage patterns or content are transmitted.
                      </li>
                      <li>
                        <strong className="text-fg-primary">Detailed:</strong> Includes additional model performance 
                        metrics. Still contains no personal data, prompts, or code.
                      </li>
                    </ul>
                  </div>

                  <div className="mt-6">
                    <h3 className="mb-3 text-lg font-semibold text-fg-primary">User controls</h3>
                    <p className="mb-3">You have complete control over your telemetry data:</p>
                    <ul className="list-disc space-y-2 pl-6">
                      <li>Enable or disable all telemetry collection via master toggle</li>
                      <li>Choose your preferred collection level</li>
                      <li>Regenerate your anonymous identifier at any time</li>
                      <li>Export all collected telemetry data as JSON</li>
                      <li>Permanently delete all collected telemetry data</li>
                    </ul>
                  </div>

                  <div className="mt-6">
                    <h3 className="mb-3 text-lg font-semibold text-fg-primary">What we do NOT collect</h3>
                    <p>
                      The following data is explicitly never collected: personal information (name, email, IP, location), 
                      file contents or source code, prompts and AI responses, file paths or project names, API keys or 
                      credentials, network information, or error details with sensitive data.
                    </p>
                  </div>

                  <div className="mt-6 flex">
                    <Link 
                      href="/privacy/telemetry" 
                      className="inline-flex items-center gap-2 text-pink hover:text-pink-bright transition-colors"
                    >
                      View detailed telemetry documentation →
                    </Link>
                  </div>
                </div>
              </section>

              {/* 3. How we use personal data */}
              <section id="how-we-use" className="mt-16 scroll-mt-24">
                <h2 className="mb-6 text-2xl font-bold text-fg-primary">3. How we use personal data</h2>
                <div className="space-y-4 text-fg-secondary">
                  <p>We may use personal data for the following purposes:</p>
                  <ul className="list-disc space-y-2 pl-6">
                    <li>To provide and maintain the Service, including optional features that enhance functionality and user experience.</li>
                    <li>To create, manage, and administer your account, including facilitating payments and responding to inquiries.</li>
                    <li>To improve and develop the Service and conduct research, including debugging and identifying or repairing issues that impair functionality.</li>
                    <li>To communicate with you, including sending updates, information about the Service, and events.</li>
                    <li>To prevent, detect, and investigate fraud, abuse, security incidents, and violations of our Terms of Service.</li>
                    <li>To comply with legal obligations and protect the rights, safety, privacy, and property of users, This Company, or third parties.</li>
                    <li>To investigate and resolve disputes or security issues.</li>
                    <li>To enforce our Terms of Service and other applicable agreements.</li>
                  </ul>
                  
                  <div className="mt-6 rounded-md border border-border-subtle bg-surface-base p-6">
                    <p className="text-sm">
                      <strong className="text-fg-primary">Important:</strong> We do not use Inputs or Suggestions 
                      to train our models, or permit third parties to use them for training, unless: (1) they are 
                      flagged for security review, (2) you explicitly report them to us as Feedback, or (3) you&apos;ve 
                      explicitly agreed to their use for such training purposes.
                    </p>
                  </div>
                </div>
              </section>

              {/* 4. How we share personal data */}
              <section id="how-we-share" className="mt-16 scroll-mt-24">
                <h2 className="mb-6 text-2xl font-bold text-fg-primary">4. How we share personal data</h2>
                <div className="space-y-4 text-fg-secondary">
                  <p>We may disclose your personal data in the following circumstances:</p>
                  <ul className="list-disc space-y-3 pl-6">
                    <li>
                      <strong className="text-fg-primary">Service Providers and Business Partners:</strong> We may 
                      disclose personal data to third-party vendors and service providers who support our business 
                      operations and help us deliver and improve the Service.
                    </li>
                    <li>
                      <strong className="text-fg-primary">Business Transfers:</strong> In the event of a merger, 
                      acquisition, restructuring, bankruptcy, or other corporate transaction, personal data may be 
                      disclosed to counterparties and advisers as part of due diligence or transferred as part of 
                      the transaction.
                    </li>
                    <li>
                      <strong className="text-fg-primary">Legal Compliance and Protection of Rights:</strong> We may 
                      disclose personal data to government authorities or other third parties if we believe doing so 
                      is necessary to comply with applicable laws, respond to lawful requests, protect the safety or 
                      rights of any person, or enforce our Terms of Service.
                    </li>
                    <li>
                      <strong className="text-fg-primary">Affiliates:</strong> We may share personal data with 
                      affiliates, meaning an entity that controls, is controlled by, or is under common control with us.
                    </li>
                    <li>
                      <strong className="text-fg-primary">Third-Party Services and Integrations:</strong> The Service 
                      may include integrations with or links to third-party websites, applications, or services. If 
                      you choose to interact with these third parties, your personal data may be disclosed to them 
                      directly and governed by their own terms and privacy policies.
                    </li>
                    <li>
                      <strong className="text-fg-primary">With Your Consent:</strong> We may disclose personal data 
                      when you give us permission to do so.
                    </li>
                  </ul>
                </div>
              </section>

              {/* 5. Retention */}
              <section id="retention" className="mt-16 scroll-mt-24">
                <h2 className="mb-6 text-2xl font-bold text-fg-primary">5. Retention</h2>
                <div className="space-y-4 text-fg-secondary">
                  <p>
                    This Company retains your personal data only for as long as necessary to operate the Service 
                    effectively and to support legitimate business needs such as legal compliance, safety, dispute 
                    resolution, and enforcement of our agreements.
                  </p>
                  <p>
                    The appropriate retention period varies depending on the purpose for which the personal data 
                    was collected, its sensitivity, potential risks associated with its use or exposure, and any 
                    applicable legal requirements.
                  </p>
                  <p>
                    When personal data is no longer needed, This Company and its service providers will follow 
                    procedures to delete, erase, de-identify, or anonymize it in compliance with applicable laws.
                  </p>
                </div>
              </section>

              {/* 6. Security */}
              <section id="security" className="mt-16 scroll-mt-24">
                <h2 className="mb-6 text-2xl font-bold text-fg-primary">6. Security</h2>
                <div className="space-y-4 text-fg-secondary">
                  <p>
                    We implement commercially reasonable technical and organizational measures designed to protect 
                    personal data from loss, misuse, and unauthorized access, disclosure, alteration, or destruction.
                  </p>
                  <p>
                    However, please remember that no method of transmission over the Internet or method of electronic 
                    storage is completely secure. You should use caution when deciding what information to share with 
                    the Service. We are not responsible for any circumvention of privacy settings or security features 
                    on the Service or on third-party websites linked through the Service.
                  </p>
                </div>
              </section>

              {/* 7. Your rights and choices */}
              <section id="your-rights" className="mt-16 scroll-mt-24">
                <h2 className="mb-6 text-2xl font-bold text-fg-primary">7. Your rights and choices</h2>
                <div className="space-y-4 text-fg-secondary">
                  <p>
                    Depending on where you live and the laws that apply in your country of residence, you may have 
                    certain rights in relation to your personal data. These may include:
                  </p>
                  <ul className="list-disc space-y-2 pl-6">
                    <li>
                      <strong className="text-fg-primary">Right to know</strong> what categories of personal data 
                      we collect, the purposes for which we use it, and the types of third parties with whom we share it.
                    </li>
                    <li>
                      <strong className="text-fg-primary">Access and portability</strong> — you can request a copy of 
                      the personal data we hold about you and, where applicable, ask us to provide it in a portable format.
                    </li>
                    <li>
                      <strong className="text-fg-primary">Deletion</strong> of personal data collected from you in 
                      connection with your use of the Service, subject to certain exceptions.
                    </li>
                    <li>
                      <strong className="text-fg-primary">Correction</strong> of inaccurate personal data we maintain about you.
                    </li>
                    <li>
                      <strong className="text-fg-primary">Objection</strong> to certain types of processing.
                    </li>
                    <li>
                      <strong className="text-fg-primary">Restriction</strong> of our processing of your personal data in limited circumstances.
                    </li>
                    <li>
                      <strong className="text-fg-primary">Withdrawal of consent</strong>, where the legal basis for our 
                      processing is based on your consent.
                    </li>
                  </ul>
                  <p className="mt-6">
                    To exercise any of these rights, you or your authorized agent may contact us at{" "}
                    <a href="mailto:support@This Company.com" className="text-pink hover:text-pink-bright">
                      support@This Company.com
                    </a>. 
                    We may request information to verify your identity before processing your request.
                  </p>
                  
                  <div className="mt-6 rounded-md border border-border-subtle bg-surface-base p-6">
                    <p className="text-sm">
                      <strong className="text-fg-primary">No sale or targeted advertising:</strong> We do not 
                      &ldquo;sell&rdquo; or &ldquo;share&rdquo; personal data for cross-contextual behavioral 
                      advertising, and we do not process personal data for &ldquo;targeted advertising&rdquo; 
                      purposes as those terms are defined under applicable US state privacy laws.
                    </p>
                  </div>
                </div>
              </section>

              {/* 8. Jurisdiction-specific disclosures */}
              <section id="jurisdiction" className="mt-16 scroll-mt-24">
                <h2 className="mb-6 text-2xl font-bold text-fg-primary">8. Jurisdiction-specific disclosures</h2>
                <div className="space-y-4 text-fg-secondary">
                  <p>
                    This Company processes your personal data for the purposes described in this Privacy Policy on 
                    servers located in various jurisdictions, including in the United States. While data protection 
                    laws vary by country, we apply the protections outlined in this policy to your personal data 
                    regardless of where it is processed, and we only transfer data in accordance with legally valid 
                    transfer mechanisms.
                  </p>
                  <p>
                    For users in the European Economic Area (&ldquo;EEA&rdquo;), when you access our Service, your 
                    personal data may be transferred to our United States servers or to other countries outside the 
                    EEA and the UK. Where information is transferred outside the EEA or the UK, we require an adequate 
                    level of data protection.
                  </p>
                </div>
              </section>

              {/* 9. Privacy policy changes */}
              <section id="changes" className="mt-16 scroll-mt-24">
                <h2 className="mb-6 text-2xl font-bold text-fg-primary">9. Privacy policy changes</h2>
                <div className="space-y-4 text-fg-secondary">
                  <p>
                    We may update this Privacy Policy from time to time. When we do, we will publish an updated 
                    version and effective date at the top of this page, unless another type of notice is legally 
                    required.
                  </p>
                  <p>
                    Your continued use of this site after any change in this Privacy Policy will constitute your 
                    acceptance of such change.
                  </p>
                </div>
              </section>

              {/* 10. Contacting us */}
              <section id="contact" className="mt-16 scroll-mt-24">
                <h2 className="mb-6 text-2xl font-bold text-fg-primary">10. Contacting us</h2>
                <div className="space-y-4 text-fg-secondary">
                  <p>
                    We encourage you to contact us if you have any questions about this Privacy Policy.
                  </p>
                  <p>
                    <strong className="text-fg-primary">Email:</strong>{" "}
                    <a href="mailto:support@This Company.com" className="text-pink hover:text-pink-bright">
                      support@This Company.com
                    </a>
                  </p>
                  <p>
                    <strong className="text-fg-primary">Address:</strong>
                    <br />
                    This Company, Inc.
                    <br />
                    Los Angeles, CA
                    <br />
                    United States
                  </p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
