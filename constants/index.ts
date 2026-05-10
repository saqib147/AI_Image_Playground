export const navLinks = [
  {
    label: "Home",
    route: "/",
    icon: "/assets/icons/home.png",
  },
  {
    label: "Image Restore",
    route: "/transformations/add/restore",
    icon: "/assets/icons/image.png",
  },
  {
    label: "Generative Fill",
    route: "/transformations/add/fill",
    icon: "/assets/icons/stars.png",
  },
  {
    label: "Object Remove",
    route: "/transformations/add/remove",
    icon: "/assets/icons/scan.png",
  },
  {
    label: "Object Recolor",
    route: "/transformations/add/recolor",
    icon: "/assets/icons/filter.png",
  },
  {
    label: "Background Remove",
    route: "/transformations/add/removeBackground",
    icon: "/assets/icons/removebg.png",
  },
  {
    label: "Profile",
    route: "/profile",
    icon: "/assets/icons/profile.png",
  },
  {
    label: "Buy Credits",
    route: "/credits",
    icon: "/assets/icons/bag.png",
  },
];

export const plans = [
  {
    _id: 1,
    name: "Starter",
    icon: "FlaskConical",
    price: 0,
    credits: 10,
    duration: "forever",
    subTitle: "10 Credits",
    inclusions: [
      {
        label: "Standard generation speed",
        isIncluded: true,
      },
      {
        label: "Basic AI models",
        isIncluded: true,
      },
      {
        label: "Community support",
        isIncluded: true,
      },
      {
        label: "Commercial usage",
        isIncluded: false,
      },
    ],
  },
  {
    _id: 2,
    name: "Pro",
    icon: "Zap",
    price: 15,
    credits: 1000,
    duration: "one-time",
    subTitle: "1,000 Credits",
    inclusions: [
      {
        label: "High-speed generation priority",
        isIncluded: true,
      },
      {
        label: "Access to all premium models",
        isIncluded: true,
      },
      {
        label: "Full commercial usage rights",
        isIncluded: true,
      },
      {
        label: "Priority email support",
        isIncluded: true,
      },
    ],
  },
  {
    _id: 3,
    name: "Premium",
    icon: "Diamond",
    price: 45,
    credits: 5000,
    duration: "one-time",
    subTitle: "5,000 Credits",
    inclusions: [
      {
        label: "Everything in Pro",
        isIncluded: true,
      },
      {
        label: "Dedicated compute nodes",
        isIncluded: true,
      },
      {
        label: "API Access (Beta)",
        isIncluded: true,
      },
      {
        label: "1-on-1 onboarding",
        isIncluded: true,
      },
    ],
  },
];

export const transformationTypes = {
  restore: {
    type: "restore",
    title: "Restore Image",
    subTitle: "Refine images by removing noise and imperfections",
    config: { restore: true, enhance: true },
    icon: "image.png",
  },
  removeBackground: {
    type: "removeBackground",
    title: "Background Remove",
    subTitle: "Removes the background of the image using AI",
    config: { removeBackground: true },
    icon: "removebg.png",
  },
  fill: {
    type: "fill",
    title: "Generative Fill",
    subTitle: "Enhance an image's dimensions using AI outpainting",
    config: { fillBackground: true },
    icon: "stars.png",
  },
  remove: {
    type: "remove",
    title: "Object Remove",
    subTitle: "Identify and eliminate objects from images",
    config: {
      remove: { prompt: "", removeShadow: true, multiple: true },
    },
    icon: "scan.png",
  },
  recolor: {
    type: "recolor",
    title: "Object Recolor",
    subTitle: "Identify and recolor objects from the image",
    config: {
      recolor: { prompt: "", to: "", multiple: true },
    },
    icon: "filter.png",
  },
};

export const aspectRatioOptions = {
  "1:1": {
    aspectRatio: "1:1",
    label: "Square (1:1)",
    width: 1000,
    height: 1000,
  },
  "3:4": {
    aspectRatio: "3:4",
    label: "Standard Portrait (3:4)",
    width: 1000,
    height: 1334,
  },
  "9:16": {
    aspectRatio: "9:16",
    label: "Phone Portrait (9:16)",
    width: 1000,
    height: 1778,
  },
};

export const defaultValues = {
  title: "",
  aspectRatio: "",
  color: "",
  prompt: "",
  publicId: "",
};

export const creditFee = -1;
