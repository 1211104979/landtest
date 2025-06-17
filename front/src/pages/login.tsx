// ----------------------------
// login.tsx または LoginPage.tsx
// ----------------------------
import { Buffer } from "buffer";
// Vite ではデフォルトで Node.js 組み込みモジュールが外部化されてしまうため
// グローバルに Buffer を登録しておかないと SIWE が動きません。
(window as any).Buffer = Buffer;

import { useState } from "react";
import type { ChangeEvent } from "react";
import {
  Globe,
  Lock,
  Eye,
  EyeOff,
  Shield,
  AlertCircle,
  CheckCircle,
  Wallet,
  ArrowRight,
} from "lucide-react";
import { SiweMessage } from "siwe";
import { ethers } from "ethers";
import { useAuth } from "../AuthContext";
// Type definitions
type LoginMethod = "wallet";
type WalletStatus = "disconnected" | "connecting" | "connected" | "error";

interface FormData {
  email: string;
  password: string;
}

interface Errors {
  email?: string;
  password?: string;
  general?: string;
  wallet?: string;
}

export default function LoginPage() {
  const [loginMethod, setLoginMethod] = useState<LoginMethod>("wallet");
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading] = useState<boolean>(false);
  const [walletStatus, setWalletStatus] =
    useState<WalletStatus>("disconnected");
  const [errors, setErrors] = useState<Errors>({});
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const { login } = useAuth();
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof Errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const connectMetaMask = async () => {
    setWalletStatus("connecting");
    setErrors({});

    try {
      if (!window.ethereum) {
        setErrors({
          wallet:
            "MetaMask is not installed. Please install MetaMask to continue.",
        });
        setWalletStatus("error");
        return;
      }

      // STEP1: MetaMask にアカウント接続をリクエスト
      const accounts: string[] = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const rawAddress = accounts[0];
      // チェックサム付きアドレスに変換
      const userAddress = ethers.getAddress(rawAddress);
      console.log("MetaMask connected. Checksum Address:", userAddress);

      // STEP3: SIWE の署名を試みる
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const network = await provider.getNetwork();

        const siweMessage = new SiweMessage({
          domain: window.location.host,
          address: userAddress,
          statement: "Sign in with Ethereum to authenticate.",
          uri: window.location.origin,
          version: "1",
          chainId: Number(network.chainId),
          nonce: Math.random().toString(36).substring(2, 15),
        });

        const messageToSign = siweMessage.prepareMessage();
        console.log("[SIWE] Message to sign:", messageToSign);
        const signature = await signer.signMessage(messageToSign);
        console.log("[SIWE] Signature:", signature);
      } catch (siweError: any) {
        console.warn(
          "⚠️ SIWE signing failed, but user remains connected:",
          siweError.message
        );
        setErrors((prev) => ({
          ...prev,
          wallet: `⚠️ SIWE signing failed: ${siweError.message}`,
        }));
      }
      setWalletAddress(userAddress);

      // STEP2: AuthContext を通じてアドレスを保存
      login(userAddress);
      console.log("[Auth] login() called with:", userAddress);

      // ウォレットステータスを “connected” に更新
      setWalletStatus("connected");
      // STEP4: ログイン後にダッシュボードへ遷移
      //navigate('/user/dashboard')
    } catch (error: any) {
      console.error("connectMetaMask error:", error);
      setWalletStatus("error");
      if (error.code === 4001) {
        setErrors({ wallet: "Connection was rejected by user." });
      } else {
        setErrors({
          wallet: `Failed to connect to MetaMask: ${error.message}`,
        });
      }
    }
  };

  const getWalletButtonContent = () => {
    switch (walletStatus) {
      case "connecting":
        return (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            <span>Connecting...</span>
          </>
        );
      case "connected":
        return (
          <>
            <CheckCircle className="w-5 h-5" />
            <span>Connected</span>
          </>
        );
      default:
        return (
          <>
            <Wallet className="w-5 h-5" />
            <span>Connect MetaMask</span>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
              <Globe className="w-8 h-8 text-blue-600" />
            </div>
            <div className="text-white">
              <h1 className="text-2xl font-bold">GovLand</h1>
              <p className="text-blue-200 text-sm">Blockchain Registry</p>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
          <p className="text-blue-200">
            Access your government land registry account
          </p>
        </div>

        {/* Login Methods Tabs */}
        <div className="bg-white/10 p-1 rounded-xl mb-6">
          <div className="grid grid-cols-2 gap-1">
            <button
              onClick={() => setLoginMethod("wallet")}
              className={`py-3 px-4 rounded-lg font-medium transition-all ${
                loginMethod === "wallet"
                  ? "bg-white text-blue-900 shadow-sm"
                  : "text-white hover:bg-white/10"
              }`}
            >
              <Wallet className="w-4 h-4 inline mr-2" />
              Wallet
            </button>
          </div>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {loginMethod === "wallet" ? (
            <div className="space-y-6">
              {/* Email Field */}
              <div>
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.password ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">
                    Remember me
                  </span>
                </label>
                <a
                  href="#"
                  className="text-sm text-blue-600 hover:text-blue-500"
                >
                  Forgot password?
                </a>
              </div>

              {/* General Error */}
              {errors.general && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    {errors.general}
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <button>
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Signing In...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          ) : (
            // Wallet Login
            <div className="space-y-6">
              <div className="text-center">
                <Wallet className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Connect Your Wallet
                </h3>
                <p className="text-gray-600">
                  Connect your MetaMask wallet to access the government land
                  registry system securely.
                </p>
              </div>

              {/* Wallet Connection Button */}
              <button
                onClick={connectMetaMask}
                disabled={
                  walletStatus === "connecting" || walletStatus === "connected"
                }
                className={`w-full py-4 px-6 rounded-xl font-medium transition-colors flex items-center justify-center space-x-3 ${
                  walletStatus === "connected"
                    ? "bg-green-600 text-white"
                    : walletStatus === "error"
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "bg-orange-500 text-white hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {getWalletButtonContent()}
              </button>

              {/* -------------------------------------------- */}
              {/* 「Connected」の下にウォレットアドレスを表示 */}
              {/* -------------------------------------------- */}
              {walletStatus === "connected" && walletAddress && (
                <p className="mt-2 text-gray-700 text-sm break-all">
                  Address : {walletAddress}
                </p>
              )}

              {/* Wallet Error */}
              {errors.wallet && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                    {errors.wallet}
                  </p>
                </div>
              )}

              {/* MetaMask Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-medium text-blue-900">
                      Secure Connection
                    </h4>
                    <p className="text-sm text-blue-700 mt-1">
                      Your wallet connection is secured by blockchain
                      cryptography. We never store your private keys.
                    </p>
                  </div>
                </div>
              </div>

              {/* Install MetaMask Link */}
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Don't have MetaMask?{" "}
                  <a
                    href="https://metamask.io/download/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-500 font-medium"
                  >
                    Install it here
                  </a>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-blue-200 text-sm">
            Don't have an account?{" "}
            <a href="#" className="text-white font-medium hover:underline">
              Contact your administrator
            </a>
          </p>
          <p className="text-blue-300 text-xs mt-4">
            Protected by government-grade security protocols
          </p>
        </div>
      </div>
    </div>
  );
}
