import { socials } from "@/data";
import React from "react";

const Footer = () => {
  return (
    <div className="bg-neutral-800 text-xs text-neutral-400">
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
          </div>
          {/* sales hours */}
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
          {/* service hours */}
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
          {/* parts hours */}
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
        {/* lower */}
        <div className="flex justify-between pb-8">
          <p>Copyright © Sony{"'"}s Auto</p>
          {/* social */}
          <ul className="flex items-center gap-8">
            {socials.map(({ name, link, icon: Icon }) => (
              <li key={name}>
                <a href={link} target="_blank" rel="noreferrer">
                  <Icon size={"1em"} color="#2563eb" strokeWidth={3} />
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
