import { Facebook, Instagram, Linkedin, Youtube } from "lucide-react";
import Image from "next/image";
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
            {/* Our Offerings */}
            <div>
              <h3 className="text-white font-semibold mb-4">Our offerings</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Holidays
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Visa
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Forex
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Hotels
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Flights
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">
                Popular destinations
              </h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Dubai
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Bali
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Thailand
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Singapore
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Malaysia
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">
                Vigovia Specials
              </h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Featured Experience
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Group Tours
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Backpackers Club
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Offline Events
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Vigovia Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Partner Portal
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Accreditations
                  </Link>
                </li>
              </ul>
            </div>

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

      <div className="bg-[#321E5D] py-6 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-sm text-gray-300 mb-4 md:mb-0">
              © 2025 Vigovia Travel Technologies (P) Ltd. All rights reserved.
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <Link
                  href="#"
                  className="bg-white rounded-full p-2 hover:bg-gray-100 transition-colors"
                >
                  <Facebook className="h-4 w-4 text-[#541C9C]" />
                </Link>
                <Link
                  href="#"
                  className="bg-white rounded-full p-2 hover:bg-gray-100 transition-colors"
                >
                  <Instagram className="h-4 w-4 text-[#541C9C]" />
                </Link>
                <Link
                  href="#"
                  className="bg-white rounded-full p-2 hover:bg-gray-100 transition-colors"
                >
                  <Linkedin className="h-4 w-4 text-[#541C9C]" />
                </Link>
                <Link
                  href="#"
                  className="bg-white rounded-full p-2 hover:bg-gray-100 transition-colors"
                >
                  <Youtube className="h-4 w-4 text-[#541C9C]" />
                </Link>
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-300">
                <Link href="#" className="hover:text-white transition-colors">
                  Privacy policy
                </Link>
                <Link href="#" className="hover:text-white transition-colors">
                  Legal notice
                </Link>
                <Link href="#" className="hover:text-white transition-colors">
                  Accessibility
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
