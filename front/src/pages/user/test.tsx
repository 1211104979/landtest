// ========== ここから：GovLand/src/pages/user/registerLand.tsx ==========
import React, { useState, useEffect } from "react";
import { Contract } from "ethers";
import {
  connectAccount,
  registerUser as registerUserOnchain,
  registerUserWithCID,
  registerLand as registerLandOnchain,
  getMyLands,
} from "../../lib/contracts";

/**
 * 「土地登録ページ」コンポーネント
 * - ウォレット接続
 * - ユーザー登録
 * - 土地登録（Lighthouse 経由で IPFS にメタデータをアップ → コントラクト登録）
 * - 自分の土地一覧取得
 */
export default function RegisterLandPage() {
  // ── 1. フォーム入力用の state ──
  const [landAddress, setLandAddress] = useState("");   // 土地の住所（例：東京都千代田区…）
  const [description, setDescription]   = useState("");   // 土地の説明テキスト

  // ── 2. ウォレット接続済みか / Contract インスタンス / アドレス ──
  const [isConnected, setIsConnected]   = useState(false);
  const [contract, setContract]         = useState<Contract | null>(null);
  const [userAddress, setUserAddress]   = useState<string>("");

  // ── 3. 処理状況を表示するためのステータス ──
  const [status, setStatus] = useState<string>("");

  // ── 4. 自分の土地一覧取得結果を保持する state ──
  const [lands, setLands] = useState<
    { landId: string; status: number; address: string; description: string }[]
  >([]);

  // ── 5. アカウントが切り替わったときに再接続 ──
  useEffect(() => {
    if (!window.ethereum) return;

    const onAccountsChanged = async (accounts: string[]) => {
      if (accounts.length === 0) {
        // MetaMask がロックされている or アカウントが存在しない状態
        setIsConnected(false);
        setUserAddress("");
        setContract(null);
        setStatus("ℹ️ Disconnected");
        setLands([]); // 土地一覧もクリア
      } else {
        // 新しいアカウントで再度 connectAccount() を呼ぶ
        await handleConnectWallet();
      }
    };

    window.ethereum.on("accountsChanged", onAccountsChanged);
    return () => {
      window.ethereum?.removeListener("accountsChanged", onAccountsChanged);
    };
  }, []);

  // ── 6. ウォレット接続ボタンを押したときのハンドラ ──
  const handleConnectWallet = async () => {
    setStatus("🔌 Connecting to MetaMask...");
    try {
      // connectAccount() は { signer, contract, userAddress } または null を返す
      const res = await connectAccount();
      if (!res) {
        setStatus("❌ MetaMask not installed or permission denied");
        return;
      }
      setContract(res.contract);
      setUserAddress(res.userAddress);
      setIsConnected(true);
      setStatus(`✅ Connected: ${res.userAddress}`);
    } catch (err: any) {
      console.error(err);
      setStatus("❌ Connection error: " + (err.message || err));
    }
  };

  // ── 7. 「ユーザー登録」ボタン押下時のハンドラ ──
  const handleRegisterUser = async () => {
    if (!contract || !userAddress) {
      setStatus("❌ Please connect wallet first");
      return;
    }
    setStatus("🧾 Registering user on-chain...");
    try {
      // registerUserOnchain() は TransactionResponse を返す
      const tx = await registerUserOnchain(contract, userAddress);
      await tx.wait(); // マイニング完了を待機
      setStatus("✅ User registered successfully");
    } catch (err: any) {
      console.error(err);
      setStatus("❌ User registration failed: " + (err.message || err));
    }
  };

  // ── 8. 「土地登録」ボタン押下時のハンドラ ──
  const handleRegisterLand = async () => {
    if (!landAddress || !description) {
      alert("住所と説明を入力してください");
      return;
    }
    if (!contract || !userAddress) {
      alert("ウォレットを接続してください");
      return;
    }
    setStatus("🚀 Uploading metadata & sending transaction...");
    try {
      // registerLandOnchain() は IPFS アップロード＋registerLand() の TransactionResponse を返す
      const tx = await registerLandOnchain(
        contract,
        userAddress,
        landAddress,
        description
      );
      await tx.wait(); // マイニング完了を待機
      setStatus("✅ Land registered on-chain successfully");
      // 登録に成功したらフォームをクリアする（お好みで）
      setLandAddress("");
      setDescription("");
    } catch (err: any) {
      console.error(err);
      setStatus("❌ Land registration failed: " + (err.message || err));
    }
  };

  // ── 9. 「自分の土地一覧取得」ボタン押下時のハンドラ ──
  const handleFetchMyLands = async () => {
    if (!contract || !userAddress) {
      setStatus("❌ Please connect wallet first");
      return;
    }
    setStatus("📦 Fetching your lands...");
    try {
      // getMyLands() は { landId, status, address, description }[] を返す
      const result = await getMyLands(contract, userAddress);
      setLands(result);
      setStatus("✅ Fetched your lands");
    } catch (err: any) {
      console.error(err);
      setStatus("❌ Error fetching lands: " + (err.message || err));
    }
  };

  return (
    <div style={{ padding: 24, maxWidth: 600, margin: "0 auto", fontFamily: "sans-serif" }}>
      <h2 style={{ marginBottom: 16, color: "#333" }}>土地登録ページ</h2>

      {/* ── 6.1. ウォレット接続ボタン ── */}
      <div style={{ marginBottom: 24 }}>
        <button
          onClick={handleConnectWallet}
          style={{
            padding: "8px 16px",
            backgroundColor: isConnected ? "#4caf50" : "#2196f3",
            color: "#fff",
            border: "none",
            borderRadius: 4,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          {isConnected ? "✅ Connected" : "🔌 Connect Wallet"}
        </button>
        {userAddress && (
          <p style={{ marginTop: 8, color: "#555" }}>
            Connected: {userAddress.slice(0, 6)}…{userAddress.slice(-4)}
          </p>
        )}
      </div>

      <hr style={{ borderColor: "#ccc", margin: "24px 0" }} />

      {/* ── 7.1. ユーザー登録セクション ── */}
      <div style={{ marginBottom: 24 }}>
        <h3 style={{ marginBottom: 8, color: "#333" }}>Register as User</h3>
        <button
          onClick={handleRegisterUser}
          disabled={!isConnected}
          style={{
            padding: "6px 14px",
            backgroundColor: isConnected ? "#ff9800" : "#ccc",
            color: "#fff",
            border: "none",
            borderRadius: 4,
            cursor: isConnected ? "pointer" : "not-allowed",
          }}
        >
          Register
        </button>
      </div>

      <hr style={{ borderColor: "#ccc", margin: "24px 0" }} />

      {/* ── 8.1. 土地登録フォーム ── */}
      <div style={{ marginBottom: 24 }}>
        <h3 style={{ marginBottom: 8, color: "#333" }}>Add Land</h3>
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "block", marginBottom: 4, color: "#555" }}>
            Address：
          </label>
          <input
            type="text"
            value={landAddress}
            onChange={(e) => setLandAddress(e.target.value)}
            style={{
              width: "100%",
              padding: 8,
              borderRadius: 4,
              border: "1px solid #888",
              fontSize: 14,
              color: "#000",
            }}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "block", marginBottom: 4, color: "#555" }}>
            Description：
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{
              width: "100%",
              padding: 8,
              borderRadius: 4,
              border: "1px solid #888",
              fontSize: 14,
              color: "#000",
              height: 80,
              resize: "vertical",
            }}
          />
        </div>
        <button
          onClick={handleRegisterLand}
          disabled={!isConnected}
          style={{
            padding: "8px 20px",
            backgroundColor: "#28a745",
            color: "#fff",
            border: "none",
            borderRadius: 4,
            cursor: isConnected ? "pointer" : "not-allowed",
            fontWeight: 500,
          }}
        >
          Register Land
        </button>
      </div>

      <hr style={{ borderColor: "#ccc", margin: "24px 0" }} />

      {/* ── 9.1. 自分の土地一覧取得セクション ── */}
      <div style={{ marginBottom: 24 }}>
        <h3 style={{ marginBottom: 8, color: "#333" }}>📦 View Your Lands</h3>
        <button
          onClick={handleFetchMyLands}
          disabled={!isConnected}
          style={{
            padding: "6px 14px",
            backgroundColor: isConnected ? "#00bcd4" : "#ccc",
            color: "#fff",
            border: "none",
            borderRadius: 4,
            cursor: isConnected ? "pointer" : "not-allowed",
          }}
        >
          Fetch My Lands
        </button>
      </div>

      {/* ── 9.2. 取得結果リストの表示 ── */}
      {lands.length === 0 ? (
        <p style={{ color: "#555" }}>土地が見つかりません。</p>
      ) : (
        <ul style={{ padding: 0, listStyle: "none", marginBottom: 24 }}>
          {lands.map((land, idx) => (
            <li
              key={idx}
              style={{
                marginBottom: 16,
                padding: 12,
                backgroundColor: "#ffffff",
                border: "1px solid #ccc",
                borderRadius: 4,
                color: "#000",
              }}
            >
              <p><strong style={{ color: "#555" }}>Land ID:</strong> {land.landId}</p>
              <p><strong style={{ color: "#555" }}>Status:</strong> {land.status}</p>
              <p><strong style={{ color: "#555" }}>Address (on-chain):</strong> {land.address}</p>
              <p><strong style={{ color: "#555" }}>Description:</strong> {land.description}</p>
            </li>
          ))}
        </ul>
      )}

      {/* ── ステータス表示 ── */}
      <p style={{ marginTop: 16, color: "#d32f2f" }}>{status}</p>
    </div>
  );
}
// ========== ここまで ==========
