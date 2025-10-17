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
    name: "Why Base",
    url: "#why-base",
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
    title: "Base Blockchain",
    description: "Fast, low-cost transactions powered by Base - Coinbase's Ethereum L2 network.",
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
    description: "Simply dial *123# on any mobile phone to access BaseFi services.",
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
    description: "Follow the prompts to complete your transaction securely on Base network.",
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
    description: "Transactions are processed quickly on the Base network with ~2 second block times.",
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

export const BASE_BENEFITS = [
  {
    title: "Lightning Fast",
    description: "~2 second block times with instant finality for seamless mobile interactions.",
    icon: Clock,
  },
  {
    title: "Ultra-Low Fees",
    description: "Minimal transaction costs (<$0.01) make micro-transactions viable for all users.",
    icon: DollarSign,
  },
  {
    title: "Scalable L2",
    description: "Built on Ethereum as a Layer 2, combining security with high throughput.",
    icon: Zap,
  },
  {
    title: "Backed by Coinbase",
    description: "Supported by Coinbase with seamless integration and strong ecosystem.",
    icon: Globe,
  },
]

// Legacy export for backward compatibility
export const AVALANCHE_BENEFITS = BASE_BENEFITS;

export const SOCIAL_LINKS = [
  {
    name: "Twitter",
    url: "https://twitter.com/basefi",
    icon: Twitter,
  },
  {
    name: "Telegram",
    url: "https://t.me/basefi",
    icon: MessageSquare,
  },
  {
    name: "GitHub",
    url: "https://github.com/tomdan-ai/basefi",
    icon: Github,
  },
]
