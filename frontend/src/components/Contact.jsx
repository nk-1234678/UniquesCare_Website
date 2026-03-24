import { useState } from "react";

const InstagramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);

const LinkedInIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect x="2" y="9" width="4" height="12"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
);

const WhatsAppIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
  </svg>
);

const MapIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
    <polyline points="15 3 21 3 21 9"/>
    <line x1="10" y1="14" x2="21" y2="3"/>
  </svg>
);

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
    services: {
      websiteDesign: false,
      contentCreation: false,
      uxDesign: false,
      strategyConsulting: false,
      userResearch: false,
      other: false,
    },
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        services: { ...prev.services, [name]: checked },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Message sent!");
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="flex flex-col lg:flex-row gap-16 lg:items-stretch">

          {/* LEFT: Contact Form */}
          <div className="w-full lg:w-1/2">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Contact our team</h1>
            <p className="text-gray-500 mb-8 text-sm leading-relaxed">
              Got any questions about the product or scaling on our platform? We're here to help.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex gap-4">
                <input
                  type="text"
                  name="firstName"
                  placeholder="First name *"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="flex-1 border border-gray-300  px-4 py-4 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent"
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last name *"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="flex-1 border border-gray-300  px-4 py-4 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent"
                />
              </div>

              <input
                type="email"
                name="email"
                placeholder="Email *"
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-gray-300  px-4 py-4 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent"
              />

              <input
                type="tel"
                name="phone"
                placeholder="Phone number"
                value={formData.phone}
                onChange={handleChange}
                className="w-full border border-gray-300  px-4 py-4 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent"
              />

              <textarea
                name="message"
                placeholder="Message *"
                rows={5}
                value={formData.message}
                onChange={handleChange}
                className="w-full border border-gray-300  px-4 py-4 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent resize-none"
              />
              <button
                type="submit"
                className="w-full bg-[#C0272D] hover:bg-[#a81f25] text-white font-semibold py-4  transition-colors duration-200 text-sm mt-2"
              >
                Send message
              </button>
            </form>
          </div>

          {/* RIGHT: Info Panel */}
          <div className="w-full lg:w-1/2 flex flex-col gap-8">

            {/* Logo — bigger */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div
                style={{
                  width: 55,
                  height: 55,
                  backgroundColor: "#C0272D",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 800,
                  color: "#ffffff",
                  fontSize: "26px",
                  boxShadow: "0 4px 12px rgba(192,39,45,0.30)",
                  flexShrink: 0,
                }}
              >
                UC
              </div>
              <div>
                <div
                  style={{
                    fontSize: "25px",
                    fontWeight: 700,
                    color: "#111827",
                    letterSpacing: "-0.02em",
                    lineHeight: "1.2",
                  }}
                >
                  UNIQUE <span style={{ color: "#C0272D" }}>CARE</span>
                </div>
                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: 500,
                    color: "#6b7280",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    marginTop: "5px",
                  }}
                >
                  Smart Lab Maintenance
                </div>
              </div>
            </div>

            {/* Chat with us */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Chat with us</h2>
              <p className="text-base text-gray-500 mb-5 leading-relaxed">
                Speak to our friendly team via live chat.
              </p>
              <div className="flex  gap-4">
                <a href="#" className="flex items-center gap-3 text-base text-gray-700 hover:text-red-600 transition-colors font-medium underline underline-offset-4">
                  <InstagramIcon /> 
                </a>
                <a href="#" className="flex items-center gap-3 text-base text-gray-700 hover:text-red-600 transition-colors font-medium underline underline-offset-4">
                  <LinkedInIcon /> 
                </a>
                <a href="#" className="flex items-center gap-3 text-base text-gray-700 hover:text-red-600 transition-colors font-medium underline underline-offset-4">
                  <WhatsAppIcon />
                </a>
              </div>
            </div>

            {/* Visit us — map grows to fill remaining height */}
            <div className="flex flex-col flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Visit us</h2>
              <p className="text-base text-gray-500 mb-4 leading-relaxed">SVIET, Banur, Punjab-140601</p>

              <div
                className="relative  overflow-hidden border border-gray-200 flex-1"
                style={{ minHeight: "250px" }}
              >
                <iframe
                  title="SVIET Banur Map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3437.348!2d76.574!3d30.588!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzDCsDM1JzE2LjgiTiA3NsKwMzQnMjYuNCJF!5e1!3m2!1sen!2sin!4v1"
                  style={{
                    border: 0,
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                  }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                <a
                  href="https://maps.google.com/?q=SVIET,Banur,Punjab"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute top-2 left-2 bg-white text-xs font-medium text-gray-700 px-3 py-1.5 rounded shadow flex items-center gap-1 hover:bg-gray-50 transition-colors"
                >
                  Open in Maps <MapIcon />
                </a>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}