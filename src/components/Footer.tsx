import { Facebook, Instagram, Linkedin, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-[#541C9C] to-[#321E5D] text-white">
      {/* Tour Packages Links */}
      <div className="bg-[#FBF4FF] text-gray-600 py-6 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 text-sm">
            <div>
              <a href="#" className="hover:text-[#541C9C] transition-colors">
                Bali Tour Packages
              </a>
            </div>
            <div>
              <a href="#" className="hover:text-[#541C9C] transition-colors">
                Japan Tour Packages
              </a>
            </div>
            <div>
              <a href="#" className="hover:text-[#541C9C] transition-colors">
                Vietnam Tour Packages
              </a>
            </div>
            <div>
              <a href="#" className="hover:text-[#541C9C] transition-colors">
                Malaysia Tour Packages
              </a>
            </div>
            <div>
              <a href="#" className="hover:text-[#541C9C] transition-colors">
                Thailand Tour Packages
              </a>
            </div>
            <div>
              <a href="#" className="hover:text-[#541C9C] transition-colors">
                Europe Tour Packages
              </a>
            </div>
            <div>
              <a href="#" className="hover:text-[#541C9C] transition-colors">
                Cultural Tour Packages
              </a>
            </div>
            <div>
              <a href="#" className="hover:text-[#541C9C] transition-colors">
                Luxury Tour Packages
              </a>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 text-sm mt-4">
            <div>
              <a href="#" className="hover:text-[#541C9C] transition-colors">
                Dubai Tour Packages
              </a>
            </div>
            <div>
              <a href="#" className="hover:text-[#541C9C] transition-colors">
                Turkey Tour Packages
              </a>
            </div>
            <div>
              <a href="#" className="hover:text-[#541C9C] transition-colors">
                UAE Tour Packages
              </a>
            </div>
            <div>
              <a href="#" className="hover:text-[#541C9C] transition-colors">
                Singapore Tour Packages
              </a>
            </div>
            <div>
              <a href="#" className="hover:text-[#541C9C] transition-colors">
                Australia Tour Packages
              </a>
            </div>
            <div>
              <a href="#" className="hover:text-[#541C9C] transition-colors">
                South Korea Tour Packages
              </a>
            </div>
            <div>
              <a href="#" className="hover:text-[#541C9C] transition-colors">
                Honeymoon Tour Packages
              </a>
            </div>
            <div>
              <a href="#" className="hover:text-[#541C9C] transition-colors">
                Adventure Tour Packages
              </a>
            </div>
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
                  <a href="#" className="hover:text-white transition-colors">
                    Holidays
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Visa
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Forex
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Hotels
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Flights
                  </a>
                </li>
              </ul>
            </div>

            {/* Popular Destinations */}
            <div>
              <h3 className="text-white font-semibold mb-4">
                Popular destinations
              </h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Dubai
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Bali
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Thailand
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Singapore
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Malaysia
                  </a>
                </li>
              </ul>
            </div>

            {/* Vigovia Specials */}
            <div>
              <h3 className="text-white font-semibold mb-4">
                Vigovia Specials
              </h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Featured Experience
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Group Tours
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Backpackers Club
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Offline Events
                  </a>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Vigovia Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Partner Portal
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Accreditations
                  </a>
                </li>
              </ul>
            </div>

            {/* More & Contact */}
            <div>
              <h3 className="text-white font-semibold mb-4">More</h3>
              <ul className="space-y-2 text-sm text-gray-300 mb-6">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Investor Relations
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Forex
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    FAQs
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Domestic Holidays
                  </a>
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
                <a
                  href="#"
                  className="bg-white rounded-full p-2 hover:bg-gray-100 transition-colors"
                >
                  <Facebook className="h-4 w-4 text-[#541C9C]" />
                </a>
                <a
                  href="#"
                  className="bg-white rounded-full p-2 hover:bg-gray-100 transition-colors"
                >
                  <Instagram className="h-4 w-4 text-[#541C9C]" />
                </a>
                <a
                  href="#"
                  className="bg-white rounded-full p-2 hover:bg-gray-100 transition-colors"
                >
                  <Linkedin className="h-4 w-4 text-[#541C9C]" />
                </a>
                <a
                  href="#"
                  className="bg-white rounded-full p-2 hover:bg-gray-100 transition-colors"
                >
                  <Youtube className="h-4 w-4 text-[#541C9C]" />
                </a>
              </div>

              {/* Legal Links */}
              <div className="flex items-center gap-4 text-sm text-gray-300">
                <a href="#" className="hover:text-white transition-colors">
                  Privacy policy
                </a>
                <a href="#" className="hover:text-white transition-colors">
                  Legal notice
                </a>
                <a href="#" className="hover:text-white transition-colors">
                  Accessibility
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
