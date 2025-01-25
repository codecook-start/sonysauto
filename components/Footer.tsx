import { socials } from "@/data";
import React from "react";
import { Phone, MapPin, Mail } from "lucide-react"; // Importing icons from lucide-react

const Footer = () => {
  return (
    <div className="bg-neutral-800 p-2 text-xs text-neutral-400">
      <div className="container-md space-y-6">
        {/* upper */}
        <div className="grid gap-8 border-b border-neutral-600 py-8 md:grid-cols-2 lg:grid-cols-4">
          {/* logo */}
          <div className="logo">
            {
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src="/logo.png"
                alt="header"
                style={{
                  width: "12rem",
                }}
                loading="lazy"
                fetchPriority="low"
              />
            }
            <div className="mt-3">
              We are many variations of passages available but the majority have
              suffered alteration in some form by injected humour words
              believable.
            </div>
            {/* Additional Info */}
            <div className="mt-4 space-y-4">
              {/* Phone */}
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-blue-500 p-2">
                  <Phone size={15} color="#fff" />
                </div>
                <span>+2 123 654 7898</span>
              </div>
              {/* Address */}
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-blue-500 p-2">
                  <MapPin size={15} color="#fff" />
                </div>
                <span>25/B Milford Road, New York</span>
              </div>
              {/* Email */}
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-blue-500 p-2">
                  <Mail size={15} color="#fff" />
                </div>
                <span>info@example.com</span>
              </div>
            </div>
          </div>

          {/* service hours */}

          {/* Sales, Service, and Parts Hours */}
          <div className="support-hours space-y-6">
            <h1
              className="mb-5 font-bold text-blue-600"
              style={{ fontSize: "20px" }}
            >
              Support Center
            </h1>
            <div className="sales-hours">
              <h4 className="font-bold text-blue-600">Sales Hours</h4>
              <p className="font-medium">
                Monday - Friday:{" "}
                <span className="font-semibold text-white/80">
                  09:00AM - 09:00PM
                </span>
              </p>
              <p className="font-medium">
                Saturday:{" "}
                <span className="font-semibold text-white/80">
                  09:00AM - 07:00PM
                </span>
              </p>
              <p className="font-medium">
                Sunday: <span>Closed</span>
              </p>
            </div>
            <div className="service-hours">
              <h4 className="font-bold text-blue-600">Service Hours</h4>
              <p className="font-medium">
                Monday - Friday:{" "}
                <span className="font-semibold text-white/80">
                  09:00AM - 06:00PM
                </span>
              </p>
              <p className="font-medium">
                Saturday:{" "}
                <span className="font-semibold text-white/80">
                  09:00AM - 02:00PM
                </span>
              </p>
              <p className="font-medium">
                Sunday: <span>Closed</span>
              </p>
            </div>
            <div className="parts-hours">
              <h4 className="font-bold text-blue-600">Parts Hours</h4>
              <p className="font-medium">
                Monday - Friday:{" "}
                <span className="font-semibold text-white/80">
                  09:00AM - 06:00PM
                </span>
              </p>
              <p className="font-medium">
                Saturday:{" "}
                <span className="font-semibold text-white/80">
                  09:00AM - 02:00PM
                </span>
              </p>
              <p className="font-medium">
                Sunday: <span>Closed</span>
              </p>
            </div>
          </div>
          {/* parts hours */}
          <div className="quick-links space-y-5">
            <h4
              className="mb-5 font-bold text-blue-600"
              style={{ fontSize: "20px" }}
            >
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="/about" className="text-white hover:text-blue-600">
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="/contact-us"
                  className="text-white hover:text-blue-600"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a href="/faq" className="text-white hover:text-blue-600">
                  FAQ
                </a>
              </li>
              <li>
                <a
                  href="/privacy-policy"
                  className="text-white hover:text-blue-600"
                >
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
          {/* Newsletter */}
          <div className="newsletter">
            <h4
              className="mb-5 font-bold text-blue-600"
              style={{ fontSize: "20px" }}
            >
              Newsletter
            </h4>
            <p className="font-medium text-white/80">
              Subscribe our newsletter to get latest update and news
            </p>
            <div className="mt-4">
              <input
                type="email"
                placeholder="Your Email"
                className="w-full rounded-lg bg-neutral-700 p-2 text-white placeholder:text-neutral-400"
              />
              <button className="mt-2 w-full rounded-lg bg-blue-600 p-2 text-white">
                Subscribe Now
              </button>
            </div>
          </div>
        </div>

        {/* lower */}
        <div className="flex justify-between pb-8">
          <p style={{ fontSize: "15px" }}>
            {" "}
            © Copyright 2025 Sony{"'"}s Auto All Rights Reserved.
          </p>
          {/* social */}
          <ul className="flex items-center gap-8">
            {socials.map(({ name, link, icon: Icon }) => (
              <li key={name}>
                <a href={link} target="_blank" rel="noreferrer">
                  <div className="rounded-full bg-blue-500 p-2">
                    <Icon size={15} color="#fff" />
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Footer;
