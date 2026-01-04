import Link from "next/link";

const TABLE_OF_CONTENTS = [
  { id: "access-use", label: "1. Access and Use" },
  { id: "eligibility", label: "2. Eligibility" },
  { id: "account", label: "3. Account Registration" },
  { id: "payment", label: "4. Payment Terms" },
  { id: "ownership", label: "5. Ownership" },
  { id: "third-party", label: "6. Third-Party Services" },
  { id: "termination", label: "7. Termination" },
  { id: "warranty", label: "8. Warranty Disclaimer" },
  { id: "liability", label: "9. Limitation of Liability" },
  { id: "indemnification", label: "10. Indemnification" },
  { id: "disputes", label: "11. Dispute Resolution" },
  { id: "miscellaneous", label: "12. Miscellaneous" },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative px-6 py-16 md:py-24">
        <div className="relative mx-auto max-w-4xl">
          <div className="mb-4 flex items-center gap-4 text-sm text-fg-muted">
            <span className="text-pink">Terms of Service</span>
            <span className="text-border-default">|</span>
            <Link href="/privacy" className="hover:text-fg-primary transition-colors">
              Privacy Policy
            </Link>
          </div>
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-fg-primary md:text-5xl">
            Terms of Service
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
              <div className="mb-12 space-y-4 text-fg-secondary">
                <p>
                  Welcome, and thank you for your interest in gremlinlabs, Inc. 
                  (&ldquo;<strong className="text-fg-primary">gremlinlabs</strong>,&rdquo; 
                  &ldquo;<strong className="text-fg-primary">we</strong>,&rdquo; or 
                  &ldquo;<strong className="text-fg-primary">us</strong>&rdquo;), makers of the 
                  Vibe Mode software platform. These Terms of Service 
                  (&ldquo;<strong className="text-fg-primary">Terms</strong>&rdquo;) govern your 
                  access to and use of gremlinlabs&apos;s software, platform, APIs, documentation, 
                  and related tools, including the website vibemode.ai, and all related software 
                  made available by gremlinlabs to build, deploy, and manage software projects 
                  (collectively, the &ldquo;<strong className="text-fg-primary">Service</strong>&rdquo;). 
                  By using the Service, you agree to these Terms.
                </p>
                <p>
                  Please also read our{" "}
                  <Link href="/privacy" className="text-pink hover:text-pink-bright">
                    Privacy Policy
                  </Link>, which explains how we collect, use, disclose, and process personal data.
                </p>
                <p>
                  If you are using the Service as part of your work for a company or organization 
                  that has a Master Services Agreement (&ldquo;MSA&rdquo;) with gremlinlabs, your 
                  use of the Service is governed by that MSA.
                </p>
                <p>
                  If you are entering into these Terms on behalf of an entity, you represent that 
                  you have the legal authority to bind that entity.
                </p>
              </div>

              {/* 1. Access and Use */}
              <section id="access-use" className="scroll-mt-24">
                <h2 className="mb-6 text-2xl font-bold text-fg-primary">1. Access and Use</h2>
                <div className="space-y-6 text-fg-secondary">
                  <div>
                    <h3 className="mb-2 text-lg font-semibold text-fg-primary">1.1. Provision of Access</h3>
                    <p>
                      gremlinlabs is building a native AI development environment for macOS. The Service 
                      offers a suite of coding tools driven by machine learning to help developers write 
                      code more easily and efficiently and can provide suggested code, outputs, or other 
                      functions. Subject to your compliance with these Terms, gremlinlabs grants you a 
                      limited right to access and use the Service.
                    </p>
                  </div>

                  <div>
                    <h3 className="mb-2 text-lg font-semibold text-fg-primary">1.2. Content</h3>
                    <p>
                      You may provide inputs to the Service (&ldquo;Inputs&rdquo;) and receive code, 
                      outputs, or other functions based on the Inputs provided by you (collectively, 
                      &ldquo;Suggestions&rdquo;) (Inputs and Suggestions are collectively 
                      &ldquo;Content&rdquo;). We may use Content to provide the Service, comply with 
                      applicable law, enforce our terms and policies, and keep the Service safe. By 
                      submitting Inputs to the Service, you represent and warrant that you have all 
                      rights, licenses, and permissions that are necessary for us to process the Inputs 
                      under these Terms and to provide the Service to you.
                    </p>
                  </div>

                  <div>
                    <h3 className="mb-2 text-lg font-semibold text-fg-primary">1.3. Model Training</h3>
                    <div className="rounded-md border border-green/30 bg-green-dim p-4">
                      <p className="font-medium text-fg-primary">
                        GREMLINLABS WILL NOT USE CONTENT TO TRAIN, OR ALLOW ANY THIRD PARTY TO TRAIN, 
                        ANY AI MODELS, UNLESS YOU&apos;VE EXPLICITLY AGREED TO THE USE OF CONTENT FOR TRAINING.
                      </p>
                    </div>
                    <p className="mt-3">
                      You can find instructions in the Service for how to manage your preferences 
                      regarding the use of Inputs and Suggestions for training.
                    </p>
                  </div>

                  <div>
                    <h3 className="mb-2 text-lg font-semibold text-fg-primary">1.4. Limitations for Suggestions</h3>
                    <p>
                      You acknowledge that Suggestions are generated automatically by machine learning 
                      technology and may be similar to or the same as Suggestions provided to other 
                      customers. Further, you acknowledge that there are numerous limitations that apply 
                      with respect to Suggestions provided by large language and other AI models, including 
                      that (i) Suggestions may contain errors or misleading information, (ii) AI Models 
                      lack the ability to think creatively and can result in repetitive content, (iii) 
                      AI Models can struggle with understanding nuances of language, and (iv) AI Models 
                      can struggle with complex tasks requiring reasoning and judgment. You agree that 
                      you are responsible for evaluating, and bearing all risks associated with, the use 
                      of any Suggestions.
                    </p>
                  </div>

                  <div>
                    <h3 className="mb-2 text-lg font-semibold text-fg-primary">1.5. Use Restrictions</h3>
                    <p className="mb-3">
                      Except and solely to the extent such a restriction is impermissible under applicable 
                      law, you may not:
                    </p>
                    <ul className="list-disc space-y-2 pl-6">
                      <li>Reverse engineer, disassemble, decompile, or attempt to derive source code from the Service</li>
                      <li>Reproduce, modify, or create derivative works of the Service</li>
                      <li>Rent, lease, lend, or sell the Service</li>
                      <li>Remove any proprietary notices from the Service</li>
                      <li>Use the Service to develop a competing product or engage in model extraction attacks</li>
                      <li>Probe, scan, or attempt to penetrate the Service</li>
                      <li>Harvest, scrape, or extract data from the Service</li>
                      <li>Use the Service in any manner that violates third-party rights or applicable laws</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="mb-2 text-lg font-semibold text-fg-primary">1.6. Beta Services</h3>
                    <p>
                      From time to time, gremlinlabs may make Beta Services available to you. Beta 
                      Services shall be clearly designated as beta, pilot, limited release, or similar. 
                      Beta Services are intended for evaluation purposes and not for production use, are 
                      not fully supported, and may be subject to additional terms. Beta Services are 
                      provided on an &ldquo;as-is&rdquo; and &ldquo;as available&rdquo; basis without 
                      any warranty. GREMLINLABS SHALL HAVE NO LIABILITY ARISING FROM BETA SERVICES - 
                      USE AT YOUR OWN RISK.
                    </p>
                  </div>

                  <div>
                    <h3 className="mb-2 text-lg font-semibold text-fg-primary">1.7. Auto-Code Execution</h3>
                    <p>
                      The Service may include features that automatically execute code Suggestions without 
                      manual review. By enabling such features, you acknowledge and agree that you are 
                      assuming all risks associated with the execution of automatically generated code, 
                      including system outages, software defects, data loss, and security vulnerabilities. 
                      YOU ARE SOLELY RESPONSIBLE FOR ANY IMPACT RESULTING FROM USE OF THESE FEATURES.
                    </p>
                  </div>
                </div>
              </section>

              {/* 2. Eligibility */}
              <section id="eligibility" className="mt-16 scroll-mt-24">
                <h2 className="mb-6 text-2xl font-bold text-fg-primary">2. Eligibility</h2>
                <div className="space-y-4 text-fg-secondary">
                  <p>
                    You must be at least the age of majority in your jurisdiction (e.g., 18 years old 
                    in the United States) or 18 years old, whichever is higher, to use the Service. 
                    By agreeing to these Terms, you represent and warrant to us that:
                  </p>
                  <ul className="list-disc space-y-2 pl-6">
                    <li>You are at least 18 years old or the age of majority in your jurisdiction</li>
                    <li>You have not previously been suspended or removed from the Service</li>
                    <li>Your registration and use of the Service complies with all applicable laws</li>
                  </ul>
                </div>
              </section>

              {/* 3. Account Registration */}
              <section id="account" className="mt-16 scroll-mt-24">
                <h2 className="mb-6 text-2xl font-bold text-fg-primary">3. Account Registration</h2>
                <div className="space-y-4 text-fg-secondary">
                  <p>
                    To access most features of the Service, you must register for an account. When 
                    you register, you may be required to provide us with information about yourself, 
                    such as your name, email address, or other contact information.
                  </p>
                  <p>
                    You agree that the information you provide to us is accurate, complete, and not 
                    misleading, and that you will keep it accurate and up to date at all times. You 
                    are solely responsible for maintaining the confidentiality of your account and 
                    password, and you accept responsibility for all activities that occur under your 
                    account.
                  </p>
                  <p>
                    If you believe that your account is no longer secure, you must immediately notify 
                    us at{" "}
                    <a href="mailto:support@gremlinlabs.com" className="text-pink hover:text-pink-bright">
                      support@gremlinlabs.com
                    </a>.
                  </p>
                </div>
              </section>

              {/* 4. Payment Terms */}
              <section id="payment" className="mt-16 scroll-mt-24">
                <h2 className="mb-6 text-2xl font-bold text-fg-primary">4. Payment Terms</h2>
                <div className="space-y-6 text-fg-secondary">
                  <div>
                    <h3 className="mb-2 text-lg font-semibold text-fg-primary">4.1. Paid Services</h3>
                    <p>
                      Certain features of the Service may require you to pay fees. Before you pay any 
                      fees, you will have an opportunity to review and accept the fees that you will 
                      be charged. Unless otherwise specifically provided, all fees are in U.S. Dollars 
                      and are non-refundable, except as required by law.
                    </p>
                  </div>

                  <div>
                    <h3 className="mb-2 text-lg font-semibold text-fg-primary">4.2. Pricing</h3>
                    <p>
                      gremlinlabs reserves the right to determine pricing for the Service. We will make 
                      reasonable efforts to keep pricing information published on the Service up to date. 
                      We may change the fees for any feature of the Service at any time. Any price changes 
                      will take effect following notice to you.
                    </p>
                  </div>

                  <div>
                    <h3 className="mb-2 text-lg font-semibold text-fg-primary">4.3. Subscriptions</h3>
                    <p>
                      The Service may include automatically recurring payments (&ldquo;Subscription&rdquo;). 
                      If you activate a Subscription, you authorize gremlinlabs to periodically charge 
                      your payment method for the Subscription. You may cancel your Subscription at any 
                      time via your account settings or by contacting us. Cancellation will be effective 
                      at the end of the current billing period.
                    </p>
                  </div>

                  <div>
                    <h3 className="mb-2 text-lg font-semibold text-fg-primary">4.4. Taxes</h3>
                    <p>
                      All fees are exclusive of taxes, and you are responsible for paying any applicable 
                      taxes.
                    </p>
                  </div>
                </div>
              </section>

              {/* 5. Ownership */}
              <section id="ownership" className="mt-16 scroll-mt-24">
                <h2 className="mb-6 text-2xl font-bold text-fg-primary">5. Ownership</h2>
                <div className="space-y-6 text-fg-secondary">
                  <div>
                    <h3 className="mb-2 text-lg font-semibold text-fg-primary">5.1. Service Ownership</h3>
                    <p>
                      The Service, including all intellectual property rights therein, is and shall 
                      remain the sole and exclusive property of gremlinlabs and its licensors. Except 
                      for the limited rights and licenses expressly granted under these Terms, nothing 
                      grants you any right, title, or interest in or to the Service.
                    </p>
                  </div>

                  <div>
                    <h3 className="mb-2 text-lg font-semibold text-fg-primary">5.2. Your Content</h3>
                    <p>
                      As between you and gremlinlabs, you retain ownership of all intellectual property 
                      rights in your Inputs. Subject to your compliance with these Terms, gremlinlabs 
                      assigns to you all its right, title, and interest in and to Suggestions.
                    </p>
                  </div>

                  <div>
                    <h3 className="mb-2 text-lg font-semibold text-fg-primary">5.3. Feedback</h3>
                    <p>
                      If you provide feedback, ideas, or suggestions about the Service 
                      (&ldquo;Feedback&rdquo;), we may use Feedback without restriction or obligation 
                      to you, and you hereby assign all right, title, and interest in Feedback to 
                      gremlinlabs.
                    </p>
                  </div>
                </div>
              </section>

              {/* 6. Third-Party Services */}
              <section id="third-party" className="mt-16 scroll-mt-24">
                <h2 className="mb-6 text-2xl font-bold text-fg-primary">6. Third-Party Services</h2>
                <div className="space-y-4 text-fg-secondary">
                  <p>
                    The Service may contain links to third-party websites, applications, or services 
                    (&ldquo;Third-Party Services&rdquo;). gremlinlabs does not control Third-Party 
                    Services, and we are not responsible for their content, privacy policies, or 
                    practices.
                  </p>
                  <p>
                    Your use of Third-Party Services is at your own risk and subject to their terms 
                    and conditions. gremlinlabs is not liable for any damages or losses caused by 
                    Third-Party Services.
                  </p>
                </div>
              </section>

              {/* 7. Termination */}
              <section id="termination" className="mt-16 scroll-mt-24">
                <h2 className="mb-6 text-2xl font-bold text-fg-primary">7. Termination</h2>
                <div className="space-y-6 text-fg-secondary">
                  <div>
                    <h3 className="mb-2 text-lg font-semibold text-fg-primary">7.1. Termination by You</h3>
                    <p>
                      You may terminate your account at any time by following the instructions in the 
                      Service or by contacting us at{" "}
                      <a href="mailto:support@gremlinlabs.com" className="text-pink hover:text-pink-bright">
                        support@gremlinlabs.com
                      </a>.
                    </p>
                  </div>

                  <div>
                    <h3 className="mb-2 text-lg font-semibold text-fg-primary">7.2. Termination by Us</h3>
                    <p>
                      We may suspend or terminate your access to the Service at any time, with or 
                      without cause, and with or without notice. Upon termination, your right to use 
                      the Service will immediately cease.
                    </p>
                  </div>

                  <div>
                    <h3 className="mb-2 text-lg font-semibold text-fg-primary">7.3. Effect of Termination</h3>
                    <p>
                      Upon termination, we may delete your account and Content. We are not required 
                      to maintain your Content. Sections 5 (Ownership), 8 (Warranty Disclaimer), 
                      9 (Limitation of Liability), 10 (Indemnification), and 11 (Dispute Resolution) 
                      will survive termination.
                    </p>
                  </div>
                </div>
              </section>

              {/* 8. Warranty Disclaimer */}
              <section id="warranty" className="mt-16 scroll-mt-24">
                <h2 className="mb-6 text-2xl font-bold text-fg-primary">8. Warranty Disclaimer</h2>
                <div className="rounded-md border border-yellow/30 bg-yellow-dim p-6 text-fg-secondary">
                  <p className="mb-4">
                    THE SERVICE IS PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo; WITHOUT 
                    WARRANTIES OF ANY KIND, WHETHER EXPRESS, IMPLIED, STATUTORY, OR OTHERWISE. TO THE 
                    MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, GREMLINLABS DISCLAIMS ALL WARRANTIES, 
                    INCLUDING ANY IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, 
                    TITLE, AND NON-INFRINGEMENT.
                  </p>
                  <p>
                    GREMLINLABS DOES NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, 
                    OR SECURE, OR THAT ANY DEFECTS WILL BE CORRECTED. YOU USE THE SERVICE AT YOUR OWN 
                    RISK.
                  </p>
                </div>
              </section>

              {/* 9. Limitation of Liability */}
              <section id="liability" className="mt-16 scroll-mt-24">
                <h2 className="mb-6 text-2xl font-bold text-fg-primary">9. Limitation of Liability</h2>
                <div className="rounded-md border border-yellow/30 bg-yellow-dim p-6 text-fg-secondary">
                  <p className="mb-4">
                    TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL GREMLINLABS, 
                    ITS AFFILIATES, OR THEIR RESPECTIVE OFFICERS, DIRECTORS, EMPLOYEES, OR AGENTS BE 
                    LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, 
                    OR ANY LOSS OF PROFITS, REVENUE, DATA, OR USE, WHETHER IN AN ACTION IN CONTRACT, 
                    TORT, OR OTHERWISE, ARISING OUT OF OR IN CONNECTION WITH THESE TERMS OR THE SERVICE.
                  </p>
                  <p>
                    IN NO EVENT SHALL GREMLINLABS&apos;S TOTAL LIABILITY TO YOU EXCEED THE GREATER OF 
                    (A) THE AMOUNTS YOU PAID TO GREMLINLABS IN THE TWELVE (12) MONTHS PRIOR TO THE 
                    CLAIM, OR (B) ONE HUNDRED DOLLARS ($100).
                  </p>
                </div>
              </section>

              {/* 10. Indemnification */}
              <section id="indemnification" className="mt-16 scroll-mt-24">
                <h2 className="mb-6 text-2xl font-bold text-fg-primary">10. Indemnification</h2>
                <div className="space-y-4 text-fg-secondary">
                  <p>
                    You agree to indemnify, defend, and hold harmless gremlinlabs, its affiliates, 
                    and their respective officers, directors, employees, and agents from and against 
                    any and all claims, damages, losses, liabilities, costs, and expenses (including 
                    reasonable attorneys&apos; fees) arising out of or in connection with:
                  </p>
                  <ul className="list-disc space-y-2 pl-6">
                    <li>Your use of the Service</li>
                    <li>Your violation of these Terms</li>
                    <li>Your violation of any rights of another party</li>
                    <li>Your Content</li>
                  </ul>
                </div>
              </section>

              {/* 11. Dispute Resolution */}
              <section id="disputes" className="mt-16 scroll-mt-24">
                <h2 className="mb-6 text-2xl font-bold text-fg-primary">11. Dispute Resolution</h2>
                <div className="space-y-6 text-fg-secondary">
                  <div>
                    <h3 className="mb-2 text-lg font-semibold text-fg-primary">11.1. Informal Resolution</h3>
                    <p>
                      Before filing a claim, you agree to try to resolve the dispute informally by 
                      contacting us at{" "}
                      <a href="mailto:support@gremlinlabs.com" className="text-pink hover:text-pink-bright">
                        support@gremlinlabs.com
                      </a>. 
                      We will try to resolve the dispute informally by contacting you via email. If 
                      a dispute is not resolved within 60 days of submission, you or gremlinlabs may 
                      proceed to arbitration.
                    </p>
                  </div>

                  <div>
                    <h3 className="mb-2 text-lg font-semibold text-fg-primary">11.2. Arbitration Agreement</h3>
                    <p>
                      You and gremlinlabs agree that any dispute, claim, or controversy arising out of 
                      or relating to these Terms or the Service shall be resolved by binding arbitration, 
                      rather than in court, except that either party may seek equitable relief in court 
                      for infringement of intellectual property rights.
                    </p>
                  </div>

                  <div>
                    <h3 className="mb-2 text-lg font-semibold text-fg-primary">11.3. Class Action Waiver</h3>
                    <div className="rounded-md border border-border-subtle bg-surface-base p-4">
                      <p className="font-medium text-fg-primary">
                        YOU AND GREMLINLABS AGREE THAT EACH MAY BRING CLAIMS AGAINST THE OTHER ONLY IN 
                        YOUR OR ITS INDIVIDUAL CAPACITY, AND NOT AS A PLAINTIFF OR CLASS MEMBER IN ANY 
                        PURPORTED CLASS OR REPRESENTATIVE PROCEEDING.
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-2 text-lg font-semibold text-fg-primary">11.4. Arbitration Procedures</h3>
                    <p>
                      Arbitration will be conducted by a neutral arbitrator in accordance with the 
                      American Arbitration Association&apos;s (&ldquo;AAA&rdquo;) rules and procedures. 
                      The arbitrator can award the same damages and relief on an individual basis that 
                      a court can award. The arbitrator&apos;s decision will be final and binding.
                    </p>
                  </div>
                </div>
              </section>

              {/* 12. Miscellaneous */}
              <section id="miscellaneous" className="mt-16 scroll-mt-24">
                <h2 className="mb-6 text-2xl font-bold text-fg-primary">12. Miscellaneous</h2>
                <div className="space-y-6 text-fg-secondary">
                  <div>
                    <h3 className="mb-2 text-lg font-semibold text-fg-primary">12.1. Entire Agreement</h3>
                    <p>
                      These Terms, including the Privacy Policy and any other agreements expressly 
                      incorporated by reference, are the entire and exclusive understanding and 
                      agreement between you and gremlinlabs regarding your use of the Service.
                    </p>
                  </div>

                  <div>
                    <h3 className="mb-2 text-lg font-semibold text-fg-primary">12.2. Assignment</h3>
                    <p>
                      You may not assign or transfer these Terms without our prior written consent. 
                      We may assign these Terms at any time without notice.
                    </p>
                  </div>

                  <div>
                    <h3 className="mb-2 text-lg font-semibold text-fg-primary">12.3. Governing Law</h3>
                    <p>
                      These Terms shall be governed by the laws of the State of California, without 
                      regard to its conflict of laws principles. Any claims not subject to arbitration 
                      shall be brought exclusively in the federal or state courts of Los Angeles County, 
                      California.
                    </p>
                  </div>

                  <div>
                    <h3 className="mb-2 text-lg font-semibold text-fg-primary">12.4. Severability</h3>
                    <p>
                      If any provision of these Terms is held to be invalid or unenforceable, the 
                      remaining provisions will remain in full force and effect.
                    </p>
                  </div>

                  <div>
                    <h3 className="mb-2 text-lg font-semibold text-fg-primary">12.5. Changes to Terms</h3>
                    <p>
                      We may modify these Terms at any time. We will provide notice of material changes 
                      by posting the updated Terms on the Service and updating the &ldquo;Last updated&rdquo; 
                      date. Your continued use of the Service after changes constitutes acceptance of 
                      the modified Terms.
                    </p>
                  </div>

                  <div>
                    <h3 className="mb-2 text-lg font-semibold text-fg-primary">12.6. Contact Information</h3>
                    <p>
                      You may contact us by sending correspondence to:
                    </p>
                    <div className="mt-3 rounded-md border border-border-subtle bg-surface-base p-4">
                      <p className="font-medium text-fg-primary">gremlinlabs, Inc.</p>
                      <p>Los Angeles, CA</p>
                      <p>United States</p>
                      <p className="mt-2">
                        Email:{" "}
                        <a href="mailto:support@gremlinlabs.com" className="text-pink hover:text-pink-bright">
                          support@gremlinlabs.com
                        </a>
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-2 text-lg font-semibold text-fg-primary">12.7. Export and Trade Controls</h3>
                    <p>
                      You must comply with all applicable trade laws, including sanctions and export 
                      control laws. The Service may not be used in or for the benefit of any U.S. 
                      embargoed country or territory, or any individual or entity with whom dealings 
                      are prohibited under applicable trade laws.
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
