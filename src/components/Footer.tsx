import { Facebook, Instagram, Linkedin, Youtube } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  // Data arrays to reduce duplication
  const tourPackagesRow1 = [
    "Bali Tour Packages",
    "Japan Tour Packages",
    "Vietnam Tour Packages",
    "Malaysia Tour Packages",
    "Thailand Tour Packages",
    "Europe Tour Packages",
    "Cultural Tour Packages",
    "Luxury Tour Packages",
  ];

  const tourPackagesRow2 = [
    "Dubai Tour Packages",
    "Turkey Tour Packages",
    "UAE Tour Packages",
    "Singapore Tour Packages",
    "Australia Tour Packages",
    "South Korea Tour Packages",
    "Honeymoon Tour Packages",
    "Adventure Tour Packages",
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

  return (
    <footer className="bg-gradient-to-r from-[#541C9C] to-[#321E5D] text-white">
      <div className="bg-[#FBF4FF] text-gray-600 py-6 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 text-sm">
            {tourPackagesRow1.map((packageName, index) => (
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
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 text-sm mt-4">
            {tourPackagesRow2.map((packageName, index) => (
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
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Dynamic Footer Sections */}
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
              </div>
            ))}

            {/* More & Contact */}
            <div>
              <h3 className="text-white font-semibold mb-4">More</h3>
              <ul className="space-y-2 text-sm text-gray-300 mb-6">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Investor Relations
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Forex
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    FAQs
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Domestic Holidays
                  </Link>
                </li>
              </ul>

              <div className="text-sm text-gray-300">
                <p className="font-semibold text-white mb-2">
                  Need help? Call us
                </p>
                <p className="mb-1">+91-98xxx64641</p>
                <p className="mb-4">Email: contact@vigovia.com</p>
                <p className="text-xs mb-2">Address:</p>
                <p className="text-xs leading-relaxed">
                  HD-109 Cinnabar Hills,Links Business Park,
                  <br />
                  Bangalore North,Bangalore,Karnataka,
                  <br />
                  India-560071
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Logo and Payment Methods */}
      <div className="border-t border-[#680099] py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-6 md:mb-0">
              <div>
                <h2 className="text-2xl font-bold text-white">vigovia</h2>
                <p className="text-xs text-gray-300 font-medium tracking-wider">
                  PLAN.PACK.GO
                </p>
              </div>
              <div className="ml-2">
                <svg width="40" height="20" viewBox="0 0 40 20" fill="none">
                  <path
                    d="M35 12L40 8L35 4"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M0 8H38"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="text-center">
              <p className="text-sm text-gray-300 mb-2">Payments</p>
              <div className="flex items-center gap-4">
                <div className="bg-white rounded px-3 py-1">
                  <span className="text-blue-600 font-bold text-sm">
                    Razorpay
                  </span>
                </div>
                <div className="bg-white rounded px-3 py-1">
                  <span className="text-blue-600 font-bold text-sm">
                    stripe
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-[#321E5D] py-6 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-sm text-gray-300 mb-4 md:mb-0">
              © 2025 Vigovia Travel Technologies (P) Ltd. All rights reserved.
            </div>

            <div className="flex items-center gap-6">
              {/* Social Media Icons */}
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

              {/* Legal Links */}
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
