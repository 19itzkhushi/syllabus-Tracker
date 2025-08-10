export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 ">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-6">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2 ">
            <div className="flex items-center space-x-3 mb-4 ">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">L</span>
              </div>
              <span className="sm:text-xl text-md font-bold">LearnFlow</span>
            </div>
            <p className="text-gray-400 mb-4 max-w-md sm:text-lg text-xs">
              Transform your Learning with our project. We help in improving the learning of students.
            </p>
          </div>

          {/* Quick Links */}
          {/* <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Services
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Blog
                </a>
              </li>
            </ul>
          </div> */}

          {/* Contact Info */}
          <div>
            <h3 className="sm:text-lg text-md font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-gray-400 sm:text-lg text-xs">
              <li>chaudharykhushi794@gmail.com</li>
              {/* <li>+1 (555) 123-4567</li> */}
              <li>
                Gautam Buddha University
                <br />
               Greater Noida,UP,201312
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 sm:text-lg text-sm">
          <p>&copy; 2025 LearnFlow. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
