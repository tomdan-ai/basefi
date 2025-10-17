import {
  Smartphone,
  Shield,
  Zap,
  Globe,
  Wallet,
  RefreshCw,
  Clock,
  DollarSign,
  Twitter,
  MessageSquare,
  Github,
  type LucideIcon,
} from "lucide-react"

export const NAV_LINKS = [
  {
    name: "How It Works",
    url: "#how-it-works",
  },
  {
    name: "Features",
    url: "#features",
  },
  {
    name: "Why Avalanche",
    url: "#why-avalanche",
  },
]

export const PROBLEM_STATS = [
  {
    value: "57%",
    label: "Unbanked Adults in Nigeria",
    description: "More than half of Nigerian adults don't have access to formal banking services.",
  },
  {
    value: "300M+",
    label: "Feature Phone Users in Africa",
    description: "Hundreds of millions rely on basic feature phones without internet capabilities.",
  },
  {
    value: "80%",
    label: "Mobile Network Coverage",
    description: "While internet penetration is low, mobile network coverage is widespread.",
  },
]

export const SOLUTION_POINTS = [
  {
    title: "USSD Technology",
    description: "Using simple dial codes (*123#) that work on any mobile phone, even without internet.",
  },
  {
    title: "Avalanche Blockchain",
    description: "Fast, low-cost transactions powered by Avalanche's high-performance network.",
  },
  {
    title: "Local Currency Support",
    description: "Buy and sell crypto using your local currency through mobile money and bank transfers.",
  },
  {
    title: "Simplified User Experience",
    description: "No complicated wallet addresses or technical knowledge required.",
  },
]

export const HOW_IT_WORKS_STEPS = [
  {
    title: "Dial the USSD Code",
    description: "Simply dial *123# on any mobile phone to access AVANOMAD services.",
  },
  {
    title: "Register or Login",
    description: "Create an account with your phone number and a secure PIN.",
  },
  {
    title: "Select Transaction Type",
    description: "Choose to buy crypto, sell crypto, check balance, or view history.",
  },
  {
    title: "Complete Transaction",
    description: "Follow the prompts to complete your transaction securely.",
  },
]

export interface Feature {
  title: string
  description: string
  icon: LucideIcon
}

export const FEATURES: Feature[] = [
  {
    title: "Works Offline",
    description: "No internet or smartphone required. Use any feature phone with USSD capability.",
    icon: Smartphone,
  },
  {
    title: "Secure Transactions",
    description: "Multi-factor authentication and encrypted communications protect your assets.",
    icon: Shield,
  },
  {
    title: "Fast Processing",
    description: "Transactions are processed quickly on the Avalanche network.",
    icon: Zap,
  },
  {
    title: "Multi-Currency Support",
    description: "Support for major cryptocurrencies and local African currencies.",
    icon: Globe,
  },
  {
    title: "Self-Custodial",
    description: "You maintain control of your assets with a non-custodial wallet solution.",
    icon: Wallet,
  },
  {
    title: "Easy Conversion",
    description: "Seamlessly convert between crypto and local currencies.",
    icon: RefreshCw,
  },
]

export const AVALANCHE_BENEFITS = [
  {
    title: "Fast Finality",
    description: "Transactions confirm in less than 2 seconds, perfect for mobile interactions.",
    icon: Clock,
  },
  {
    title: "Low Fees",
    description: "Minimal transaction costs make micro-transactions viable for all users.",
    icon: DollarSign,
  },
  {
    title: "Scalability",
    description: "Handles thousands of transactions per second to support mass adoption.",
    icon: Zap,
  },
  {
    title: "Eco-Friendly",
    description: "Energy-efficient consensus mechanism with minimal environmental impact.",
    icon: Globe,
  },
]

export const SOCIAL_LINKS = [
  {
    name: "Twitter",
    url: "https://twitter.com/avanomad",
    icon: Twitter,
  },
  {
    name: "Telegram",
    url: "https://t.me/avanomad",
    icon: MessageSquare,
  },
  {
    name: "GitHub",
    url: "https://github.com/tomdan-ai/avanomad",
    icon: Github,
  },
]
