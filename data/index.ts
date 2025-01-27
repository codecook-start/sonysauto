import { Detail, ItemDetailName, ItemInsightName } from "@/types/car";
import {
  Car,
  Fuel,
  Gauge,
  Milestone,
  Calendar,
  Factory,
  Cog,
  Compass,
  Paintbrush,
  Sofa,
  Barcode,
  DoorOpen,
  Tag,
  MailIcon,
} from "lucide-react";
import {
  Facebook,
  Instagram,
  MapPin,
  Phone,
  Twitter,
  Youtube,
} from "react-feather";

export const routes = [
  {
    name: "Inventory In Japan",
    route: "/japan",
  },
  {
    name: "Inventory In Cayman",
    route: "/cayman",
  },
  {
    name: "Reserved Or Sold",
    route: "/reserved",
  },
  {
    name: "Shipping Soon",
    route: "/shipping",
  },
  {
    name: "Shipped",
    route: "/shipped",
  },
  {
    name: "About Us",
    route: "/about",
  },
  {
    name: "Bin",
    route: "/deletedcar",
  },
];

export const dealer = {
  name: "Sony's Auto",
  phone: "+13453245773",
  email: "sonysauto@hotmail.com",
};

export const contact = [
  {
    name: "phone",
    link: "tel:+13453245773",
    number: "+13453245773",
    icon: Phone,
  },
  {
    name: "email",
    link: "mailto:sonysauto@hotmail.com",
    email: "sonysauto@hotmail.com",
    icon: MailIcon,
  },
  {
    name: "location",
    link: "https://www.google.com/maps",
    icon: MapPin,
    address: "1234 Main St, City, State 12345",
  },
  {
    name: "timing",
    link: "https://www.google.com/maps",
    timing: "Mon - Fri: 9am - 5pm",
    icon: Calendar,
  },
];

export const socials = [
  {
    name: "facebook",
    link: "https://www.facebook.com",
    icon: Facebook,
  },
  {
    name: "twitter",
    link: "https://www.twitter.com",
    icon: Twitter,
  },
  {
    name: "instagram",
    link: "https://www.instagram.com",
    icon: Instagram,
  },
  {
    name: "youtube",
    link: "https://www.youtube.com",
    icon: Youtube,
  },
];

export const carDetailMap = {
  type: Car,
  model: Car,
  year: Calendar,
  fuel: Fuel,
  color: Paintbrush,
  transmission: Cog,
  make: Factory,
  modelCode: Barcode,
  stockId: Tag,
  kilometers: Milestone,
  engineSize: Gauge,
  drive: Compass,
  interior: Sofa,
  doorsSeats: DoorOpen,
};

export const carFeatures: string[] = [
  "Power Steering",
  "Power Windows",
  "Electric Side Mirrors",
  "Air Conditioning",
  "Antilock Brakes System",
  "Front and Side Airbags",
  "Central Locking",
  "Digital Panel",
  "Steering Wheel Controls",
  "Push Button Start",
  "Electronic Parking Brake",
  "Smart Key",
  "Keyless Entry",
  "2 Sets of Keys",
  "Back/Reverse Camera",
  "LED/Hid/Xenon Lamps",
  "CD/TV/DVD Navigation",
  "Rear Spoiler",
  "High Mount Stop Lamp",
  "Keyless Trunk",
  "Rear Wiper",
  "Alloy Wheels",
];

export const slides = [
  "/1.jpg",
  "/2.jpg",
  "/3.jpg",
  "/4.jpg",
  "/1.jpg",
  "/2.jpg",
  "/3.jpg",
  "/4.jpg",
  "/1.jpg",
  "/2.jpg",
  "/3.jpg",
  "/4.jpg",
];

export const features = [
  "Power Steering",
  "Power Windows",
  "Electric Side Mirrors",
  "Side Mirrors Indicator",
  "Air Conditioning",
  "Antilock Brakes System",
  "Dual Front Airbags",
  "Front and Side Airbags",
  "Central Locking",
  "Digital Panel",
  "Steering Wheel Controls",
  "Push Button Start",
  "Electronic Parking Brake",
  "Smart Key",
  "Keyless Entry",
  "2 Sets of Keys",
  "Back/Reverse Camera",
  "LED/Hid/Xenon Lamps",
  "CD/TV/DVD Navigation",
  "CD Player",
  "Rear Spoiler",
  "High Mount Stop Lamp",
  "Keyless Trunk",
  "Rear Wiper",
  "Alloy Wheels",
  "4WD",
  "Leather Seats",
  "Leather Interior",
  "Half Leather",
  "Fully Powered Seats",
  "Auto Sunroof",
  "Auto Light",
  "Fog Light",
  "Roof Rails",
  "Bluetooth Connection",
  "USB Ports",
  "SD Card",
  "Micro SD Card",
  "iPod Connection",
  "HDMI Cable",
  "Wi-Fi",
  "Wireless Charging",
  "Multi-view Camera System",
  "Blind Spot Information",
  "Electronic Stability Control",
  "Power Sliding Doors",
  "LED Radar",
  "Turbo",
  "Honda Magic Seats",
  "Ventilated seats",
  "Seat Heater",
  "Security Alarm",
  "Corner Sensor",
  "Electric Rear Gate",
  "Body Kit",
  "5 Doors & 5 Seats",
];

export type FieldType = "select" | "input";

export type FormField<T> = {
  id: string;
  name: T;
  label: string;
  type: FieldType;
  options?: string[];
};

export const initialItemDetailsFormFields: FormField<ItemDetailName>[] = [
  {
    id: "type",
    name: "type",
    label: "Type",
    type: "select",
    options: ["Sedan", "SUV", "Hatchback", "Truck", "Van"],
  },
  {
    id: "model",
    name: "model",
    label: "Model",
    type: "input",
  },
  {
    id: "year",
    name: "year",
    label: "Year",
    type: "select",
    options: ["2020", "2021", "2022", "2023", "2024"],
  },
  {
    id: "fuel",
    name: "fuel",
    label: "Fuel",
    type: "select",
    options: ["Petrol", "Diesel", "Electric", "Hybrid"],
  },
  {
    id: "color",
    name: "color",
    label: "Color",
    type: "select",
    options: ["Red", "Blue", "Green", "Yellow", "Black", "White", "Silver"],
  },
  {
    id: "transmission",
    name: "transmission",
    label: "Transmission",
    type: "select",
    options: ["Automatic", "Manual"],
  },
  {
    id: "make",
    name: "make",
    label: "Make",
    type: "input",
  },
  {
    id: "modelCode",
    name: "modelCode",
    label: "Model Code",
    type: "input",
  },
  {
    id: "stockId",
    name: "stockId",
    label: "Stock ID",
    type: "input",
  },
];

export const initialItemInsightsFormFields: FormField<ItemInsightName>[] = [
  {
    id: "kilometers",
    name: "kilometers",
    label: "Kilometers",
    type: "input",
  },
  {
    id: "miles",
    name: "miles",
    label: "Miles",
    type: "input",
  },
  {
    id: "engineSize",
    name: "engineSize",
    label: "Engine Size",
    type: "input",
  },
  {
    id: "drive",
    name: "drive",
    label: "Drive",
    type: "select",
    options: ["2WD", "4WD"],
  },
  {
    id: "interior",
    name: "interior",
    label: "Interior",
    type: "select",
    options: ["Grey", "Black", "Beige"],
  },
  {
    id: "doorsSeats",
    name: "doorsSeats",
    label: "Doors & Seats",
    type: "select",
    options: ["2", "4", "5", "7"],
  },
];

export const initialCarFormFields: Detail<string[]>[] = [
  {
    name: "type",
    values: ["Sedan"],
  },
  {
    name: "model",
    values: [],
  },
  {
    name: "year",
    values: ["2020"],
  },
  {
    name: "fuel",
    values: ["Petrol"],
  },
  {
    name: "color",
    values: ["Red"],
  },
  {
    name: "transmission",
    values: ["Automatic"],
  },
  {
    name: "make",
    values: ["Make"],
  },
  {
    name: "modelCode",
    values: ["Model Code"],
  },
  {
    name: "stockId",
    values: [],
  },
  {
    name: "kilometers",
    values: [],
  },
  {
    name: "miles",
    values: [],
  },
  {
    name: "engineSize",
    values: [],
  },
  {
    name: "drive",
    values: ["2WD"],
  },
  {
    name: "interior",
    values: ["Grey"],
  },
  {
    name: "doorsSeats",
    values: ["2"],
  },
];

export const initialSellerNotesFormFields: string[] = [
  "location-shipping",
  "vehicle-condition",
  "payments",
  "warranty",
  "service",
  "about-us",
];

export const titleMap = {
  "/": "",
  "/japan": "Inventory in Japan",
  "/cayman": "Inventory in Cayman",
  "/reserved": "Inventory in Reserved",
  "/shipping": "Inventory in Shipping Soon",
  "/shipped": "Inventory in Shipped",
};
