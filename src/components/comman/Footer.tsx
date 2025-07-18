import { Facebook, Instagram, Linkedin, Youtube } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  const tourPackages = [
    [
      "Bali Tour Packages",
      "Japan Tour Packages",
      "Vietnam Tour Packages",
      "Malaysia Tour Packages",
      "Thailand Tour Packages",
      "Europe Tour Packages",
      "Cultural Tour Packages",
      "Luxury Tour Packages",
    ],
    [
      "Dubai Tour Packages",
      "Turkey Tour Packages",
      "UAE Tour Packages",
      "Singapore Tour Packages",
      "Australia Tour Packages",
      "South Korea Tour Packages",
      "Honeymoon Tour Packages",
      "Adventure Tour Packages",
    ],
  ];

  const footerSections = [
    {
      title: "Our offerings",
      links: ["Holidays", "Visa", "Forex", "Hotels", "Flights"],
    },
    {
      title: "Popular destinations",
      links: ["Dubai", "Bali", "Thailand", "Singapore", "Malaysia"],
    },
    {
      title: "Vigovia Specials",
      links: [
        "Featured Experience",
        "Group Tours",
        "Backpackers Club",
        "Offline Events",
      ],
    },
    {
      title: "Company",
      links: [
        "About Us",
        "Careers",
        "Vigovia Blog",
        "Partner Portal",
        "Accreditations",
      ],
    },
    {
      title: "More",
      links: ["Investor Relations", "Forex", "FAQs", "Domestic Holidays"],
    },
  ];

  const socialMediaIcons = [
    { Icon: Facebook, href: "#" },
    { Icon: Instagram, href: "#" },
    { Icon: Linkedin, href: "#" },
    { Icon: Youtube, href: "#" },
  ];

  const legalLinks = [
    { text: "Privacy policy", href: "#" },
    { text: "Legal notice", href: "#" },
    { text: "Accessibility", href: "#" },
  ];

  const paymentMethods = [
    { name: "Razorpay", color: "text-blue-600" },
    { name: "stripe", color: "text-blue-600" },
  ];

  const contactInfo = {
    phone: "+91-98xxx64641",
    email: "contact@vigovia.com",
    address: [
      "HD-109 Cinnabar Hills,Links Business Park,",
      "Bangalore North,Bangalore,Karnataka,",
      "India-560071",
    ],
  };

  return (
    <footer className="bg-gradient-to-r from-[#541C9C] to-[#321E5D] text-white">
      <div className="bg-[#FBF4FF] text-gray-600 py-6 px-4">
        <div className="max-w-7xl mx-auto">
          {tourPackages.map((packageRow, rowIndex) => (
            <div
              key={rowIndex}
              className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 text-sm mt-4 first:mt-0"
            >
              {packageRow.map((packageName, index) => (
                <div key={index}>
                  <Link
                    href="#"
                    className="hover:text-[#541C9C] transition-colors"
                  >
                    {packageName}
                  </Link>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {footerSections.map((section, index) => (
              <div key={index}>
                <h3 className="text-white font-semibold mb-4">
                  {section.title}
                </h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link
                        href="#"
                        className="hover:text-white transition-colors"
                      >
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
                {section.title === "More" && (
                  <div className="text-sm text-gray-300 mt-6">
                    <p className="font-semibold text-white mb-2">
                      Need help? Call us
                    </p>
                    <p className="mb-1">{contactInfo.phone}</p>
                    <p className="mb-4">Email: {contactInfo.email}</p>
                    <p className="text-xs mb-2">Address:</p>
                    <p className="text-xs leading-relaxed">
                      {contactInfo.address.map((line, lineIndex) => (
                        <span key={lineIndex}>
                          {line}
                          {lineIndex < contactInfo.address.length - 1 && <br />}
                        </span>
                      ))}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t bg-[#FBF4FF] border-[#680099] py-6 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-3 mb-6 md:mb-0">
              <div>
                <Image
                  src="/final-logo-2.png"
                  alt="Vigovia Logo"
                  width={200}
                  height={200}
                  className="bg-transparent"
                />
              </div>
            </div>

            <div className="text-center items-center">
              <p className="text-sm text-gray-600 mb-2">Payments</p>
              <div className="flex items-center gap-4">
                {paymentMethods.map((payment, index) => (
                  <div key={index} className="bg-white rounded px-3 py-1">
                    <span className={`${payment.color} font-bold text-sm`}>
                      {payment.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#321E5D] py-6 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-sm text-gray-300 mb-4 md:mb-0">
              © 2025 Vigovia Travel Technologies (P) Ltd. All rights reserved.
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                {socialMediaIcons.map((social, index) => (
                  <Link
                    key={index}
                    href={social.href}
                    className="bg-white rounded-full p-2 hover:bg-gray-100 transition-colors"
                  >
                    <social.Icon className="h-4 w-4 text-[#541C9C]" />
                  </Link>
                ))}
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-300">
                {legalLinks.map((link, index) => (
                  <Link
                    key={index}
                    href={link.href}
                    className="hover:text-white transition-colors"
                  >
                    {link.text}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
