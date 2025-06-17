// ========== ここから：GovLand/src/pages/user/registerLand.tsx ==========
import { useState, useEffect } from "react";
import { ethers, Contract } from "ethers";
import lighthouse from "@lighthouse-web3/sdk";
import LandRegistryABI from "../../abi/LandRegistry.json";

// ※Window.ethereum の型定義は、別途 global.d.ts 等で行っている前提です
// （もしまだ定義していなければ、src/global.d.ts に簡易的に declare global { interface Window { ethereum?: any } } export {} を置いてください）

// .env から読み込むコントラクトアドレスと Lighthouse API キー
const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS!;
const LIGHTHOUSE_API_KEY = import.meta.env.VITE_LIGHTHOUSE_API_KEY!;

export default function RegisterLandPage() {
  // ── 1. フォーム入力用の state ──
  const [landAddress, setLandAddress] = useState("");       // 土地の住所（文字列）
  const [description, setDescription] = useState("");       // 土地の説明（文字列）

  // ── 2. MetaMask 接続＆コントラクトオブジェクト用の state ──
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);
  const [contract, setContract] = useState<Contract | null>(null);
  const [userAddress, setUserAddress] = useState<string>("");

  // ── 3. 自分が所有している土地一覧取得用の state ──
  const [lands, setLands] = useState<
    { landId: string; status: number; address: string; description: string }[]
  >([]);

  // ── 4. ユーザー操作や処理のステータス表示用 ──
  const [status, setStatus] = useState<string>("");

  // ── 5. accountsChanged イベントでアカウント切り替わったら再初期化 ──
  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        // MetaMask ロック状態など
        setIsConnected(false);
        setUserAddress("");
        setSigner(null);
        setContract(null);
        setLands([]);
        setStatus("ℹ️ Disconnected");
      } else {
        // 新しいアカウントで初期化
        initializeConnection(accounts[0]);
      }
    };

    window.ethereum.on("accountsChanged", handleAccountsChanged);
    return () => {
      window.ethereum?.removeListener("accountsChanged", handleAccountsChanged);
    };
  }, []);

  // ── 6. 汎用：アカウント＆コントラクトを state にセットする関数 ──
  const initializeConnection = async (address: string) => {
    try {
      const ethereum = window.ethereum as any;
      // ethers@6 では BrowserProvider を使う
      const provider = new ethers.BrowserProvider(ethereum);
      const newSigner = await provider.getSigner();
      const newContract = new ethers.Contract(CONTRACT_ADDRESS, LandRegistryABI.abi, newSigner);

      setSigner(newSigner);
      setUserAddress(address);
      setContract(newContract);
      setIsConnected(true);
      setLands([]); // アカウント切り替え時は土地一覧をクリア
      setStatus(`✅ Connected: ${address}`);
    } catch (err: any) {
      console.error(err);
      setStatus("❌ Connection Error: " + err.message);
    }
  };

  // ── 7. connectWallet：MetaMask 承認を出して initializeConnection を呼ぶ ──
  const connectWallet = async () => {
    try {
      if (!window.ethereum) throw new Error("MetaMask not detected");

      // 必ずポップアップを出す
      const accounts: string[] = await window.ethereum.request({ method: "eth_requestAccounts" });
      if (accounts.length === 0) {
        setStatus("ℹ️ No accounts found");
        return;
      }
      await initializeConnection(accounts[0]);
    } catch (err: any) {
      console.error(err);
      setStatus("❌ Wallet Connection Error: " + err.message);
    }
  };

  // ── 8. registerUser：コントラクトの selfRegisterUser() を呼び出し ──
  const registerUser = async () => {
    if (!contract || !userAddress) {
      setStatus("❌ Connect wallet first");
      return;
    }
    try {
      const role = await contract.roles(userAddress);
      if (role.toString() !== "0") {
        setStatus("✅ Already registered");
        return;
      }
      setStatus("🧾 Registering as user...");
      const regTx = await contract.selfRegisterUser();
      await regTx.wait();
      setStatus("✅ User registered");
    } catch (err: any) {
      console.error(err);
      setStatus("❌ Registration Error: " + err.message);
    }
  };

  // ── 9. registerLand：IPFS アップロード → コントラクト登録 ──
  const registerLand = async () => {
    if (!landAddress || !description) {
      alert("住所と説明を入力してください");
      return;
    }
    if (!contract || !signer || !userAddress) {
      alert("ウォレットを接続してください");
      return;
    }
    try {
      // （a）ユーザー権限チェック
      const role = await contract.roles(userAddress);
      if (role.toString() !== "1") {
        throw new Error("❌ User is not registered");
      }

      // （b）Lighthouse 経由でメタデータを IPFS にアップロード
      setStatus("🚀 Uploading metadata to IPFS via Lighthouse...");
      const metadata = { address: landAddress, description };
      const blob = new Blob([JSON.stringify(metadata)], { type: "application/json" });
      const file = new File([blob], "land_metadata.json");
      const uploadResponse = await lighthouse.upload([file], LIGHTHOUSE_API_KEY);
      const cid = uploadResponse.data.Hash;
      setStatus(`✅ Uploaded: ipfs://${cid}`);

      // （c）コントラクトの registerLand メソッドを呼び出し
      setStatus("⛓️ Calling registerLand...");
      const tx = await contract.registerLand(userAddress, cid);
      await tx.wait();
      setStatus("✅ Land registered successfully!");
    } catch (err: any) {
      console.error(err);
      setStatus("❌ Land Registration Error: " + err.message);
    }
  };

  // ── 10. fetchMyLands：getOwnedLands + getLand で情報をまとめる ──
  const fetchMyLands = async () => {
    if (!contract || !userAddress) {
      setStatus("❌ Connect wallet first");
      return;
    }
    try {
      setStatus("📦 Fetching your lands...");
      const landIds: bigint[] = await contract.getOwnedLands(userAddress);

      const fetchPromises = landIds.map(async (id) => {
        const [landOnchain] = await contract.getLand(id);
        const statusCode: number = landOnchain.status;
        const cid: string = landOnchain.metadataCID;

        // 試行する IPFS ゲートウェイ一覧
        const gateways = [
          `https://gateway.lighthouse.storage/ipfs/${cid}`,
        ];

        let jsonMeta: { address: string; description: string } | null = null;
        for (const gatewayURL of gateways) {
          console.log(`Trying to fetch metadata from: ${gatewayURL}`);
          try {
            const resp = await fetch(gatewayURL, { cache: "no-store" });
            if (resp.ok) {
              jsonMeta = await resp.json();
              break;
            } else {
              console.warn(`Fetch failed at ${gatewayURL}, status: ${resp.status}`);
            }
          } catch (e) {
            console.warn(`Error fetching from ${gatewayURL}: ${(e as Error).message}`);
          }
        }

        if (!jsonMeta) {
          return {
            landId: id.toString(),
            status: statusCode,
            address: "N/A",
            description: "Unable to load metadata",
          };
        }

        return {
          landId: id.toString(),
          status: statusCode,
          address: jsonMeta.address,
          description: jsonMeta.description,
        };
      });

      const myLands = await Promise.all(fetchPromises);
      setLands(myLands);
      setStatus("✅ Fetched your lands");
    } catch (err: any) {
      console.error(err);
      setStatus("❌ Error fetching lands: " + err.message);
    }
  };

  // ── 11. JSX レンダリング部分 ──
  return (
    <div
      style={{
        padding: 16,
        backgroundColor: "#f5f5f5",    // 背景を薄いグレーに変更
        color: "#000",                  // 文字色を黒に
        fontFamily: "sans-serif",
        minHeight: "100vh",
      }}
    >
      <h2 style={{ marginBottom: 16, color: "#333" }}>
        Land Register NFT Prototype
      </h2>

      {/* ── 11.1. ウォレット接続 ── */}
      <div style={{ marginBottom: 24 }}>
        <button
          onClick={connectWallet}
          style={{
            padding: "8px 16px",
            backgroundColor: isConnected ? "#4caf50" : "#2196f3", // 接続済みなら緑、それ以外は青
            color: "#fff",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
            fontWeight: 600,
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

      <hr style={{ borderColor: "#ccc", marginBottom: 24 }} />

      {/* ── 11.2. ユーザー登録 ── */}
      <div style={{ marginBottom: 24 }}>
        <h3 style={{ marginBottom: 8, color: "#333" }}>Register as User</h3>
        <button
          onClick={registerUser}
          disabled={!isConnected}
          style={{
            padding: "6px 14px",
            backgroundColor: isConnected ? "#ff9800" : "#ccc", // 接続済みならオレンジ、未接続ならグレー
            color: "#fff",
            border: "none",
            borderRadius: 4,
            cursor: isConnected ? "pointer" : "not-allowed",
            fontWeight: 500,
          }}
        >
          Register
        </button>
      </div>

      <hr style={{ borderColor: "#ccc", marginBottom: 24 }} />

      {/* ── 11.3. 土地登録フォーム ── */}
      <div style={{ marginBottom: 24 }}>
        <h3 style={{ marginBottom: 8, color: "#333" }}>Add Land</h3>
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "block", marginBottom: 4, color: "#555" }}>
            Address:
          </label>
          <input
            type="text"
            value={landAddress}
            onChange={(e) => setLandAddress(e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: 4,
              border: "1px solid #888",
              fontSize: 14,
              color: "#000",
            }}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "block", marginBottom: 4, color: "#555" }}>
            Description:
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: 4,
              border: "1px solid #888",
              fontSize: 14,
              color: "#000",
              height: 100,
              resize: "vertical",
            }}
          />
        </div>
        <button
          onClick={registerLand}
          disabled={!isConnected}
          style={{
            marginTop: 8,
            padding: "8px 20px",
            backgroundColor: "#28a745", // 緑色
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

      {/* ステータス表示 */}
      <p style={{ margin: "12px 0", color: "#d32f2f" }}>{status}</p>

      <hr style={{ borderColor: "#ccc", marginBottom: 24 }} />

      {/* ── 11.4. 自分の土地一覧取得 ── */}
      <div style={{ marginBottom: 24 }}>
        <h3 style={{ marginBottom: 8, color: "#333" }}>📦 View Your Lands</h3>
        <button
          onClick={fetchMyLands}
          disabled={!isConnected}
          style={{
            padding: "6px 16px",
            backgroundColor: "#00bcd4", // 水色
            color: "#fff",
            border: "none",
            borderRadius: 4,
            cursor: isConnected ? "pointer" : "not-allowed",
            fontWeight: 500,
          }}
        >
          Get My Lands
        </button>

        <ul style={{ marginTop: 16, listStyle: "none", padding: 0 }}>
          {lands.map((land, idx) => (
            <li
              key={idx}
              style={{
                marginBottom: 16,
                padding: 12,
                backgroundColor: "#ffffff", // 白背景にして文字をはっきり見えるように
                border: "1px solid #ccc",
                borderRadius: 4,
                color: "#000",
              }}
            >
              <p>
                <strong style={{ color: "#555" }}>ID:</strong> {land.landId}
              </p>
              <p>
                <strong style={{ color: "#555" }}>Status:</strong> {land.status}
              </p>
              <p>
                <strong style={{ color: "#555" }}>住所:</strong> {land.address}
              </p>
              <p>
                <strong style={{ color: "#555" }}>説明:</strong> {land.description}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
// ========== ここまで ==========
