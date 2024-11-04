import React, { useState, useEffect } from "react";
import Modal from "./components/shared/Modal";
import ExpiredImage from "./assets/images/link-expired.png";

interface AddWalletProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddWallet: React.FC<AddWalletProps> = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [accountError, setAccountError] = useState<string>("");
  const [wallets, setWallets] = useState<string[]>([]); // Assuming you have a list of wallets
  const [selectedWallet, setSelectedWallet] = useState<string>("");

  const fetchWallets = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3090/wallets"); // Fetch available wallets
      if (!response.ok) throw new Error("Network error");
      const data = await response.json();

      setWallets(data);
    } catch (err) {
      setError("Network error: Unable to fetch accounts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    new Promise((resolve, reject) => {
      fetch("http://localhost:3090/wallets")
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          if (isMounted) {
            resolve(data); // Resolve the promise with the fetched data
          }
        })
        .catch((err) => {
          if (isMounted) {
            reject("Network Error: Unable to fetch accounts.");
          }
        });
    })
      .then((data: any) => {
        if (isMounted) {
          setWallets(data);
        }
      })
      .catch((error) => {
        if (isMounted) {
          setError(error as string);
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  const createWallet = async () => {
    try {
      setLoading(true);
      setAccountError("");
      const response = await fetch("http://localhost:3090/accounts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ currency: selectedWallet }),
      });
      if (!response.ok) throw new Error("Network error");
      // onClose(); // Close the modal on success
    } catch (err) {
      setAccountError("Network error");
    } finally {
      setLoading(false);
      setSelectedWallet("");
    }
  };

  const handleErrorClear = () => {
    setAccountError("");
  };

  return (
    <Modal isOpen={isOpen}>
      <div className="px-7 py-[80px]">
        <div className="flex items-center justify-between">
          <h3 className="text-[24px] text-black">Add new wallet</h3>
          <span
            onClick={onClose}
            data-testid="close-button"
            aria-label="Close button"
            className="cursor-pointer"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M15.4834 12.9889C16.1722 13.6777 16.1722 14.7946 15.4834 15.4834C14.7946 16.1722 13.6777 16.1722 12.9889 15.4834L8 10.4945L3.01108 15.4834C2.32225 16.1722 1.20545 16.1722 0.51662 15.4834C-0.172207 14.7946 -0.172207 13.6777 0.51662 12.9889L5.50554 8L0.51662 3.01108C-0.172207 2.32225 -0.172207 1.20545 0.51662 0.51662C1.20545 -0.172207 2.32225 -0.172207 3.01108 0.51662L8 5.50554L12.9889 0.51662C13.6777 -0.172207 14.7946 -0.172207 15.4834 0.51662C16.1722 1.20545 16.1722 2.32225 15.4834 3.01108L10.4945 8L15.4834 12.9889Z"
                fill="black"
              />
            </svg>
          </span>
        </div>
        <div className="mt-5 items-center">
          <p className="text-[15px] font-[400] text-[#3E4C59]">
            The crypto wallet will be created instantly and be available in your
            list of wallets.
          </p>
        </div>

        <div className="mt-5 flex flex-col gap-3">
          <label htmlFor="selectId" className="text-[16px] text-[#3E4C59]">
            Select wallet
          </label>
          <select
            aria-roledescription="combobox"
            className="h-[64px] w-full rounded-sm border border-[#CBD2D9] px-3"
            id="selectId"
            value={selectedWallet}
            onChange={(e) => setSelectedWallet(e.target.value)}
          >
            <option value="">Select a wallet</option>
            {wallets.map((wallet: any, index) => (
              <option key={index} value={wallet.currency}>
                {wallet.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mt-5 flex items-center justify-center">
          <button
            onClick={createWallet}
            className="h-[54px] w-[180px] rounded-full bg-black text-white"
            disabled={loading || !selectedWallet}
          >
            {loading ? "Creating wallet..." : "Create wallet"}
          </button>
        </div>

        {accountError && (
          <div className="mt-8 flex h-[50px] w-[392px] items-center justify-between rounded-sm border border-[#E0B3B2] bg-[#FFF4F4] px-6">
            <div className="flex items-center gap-2">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_11_589)">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M11.7679 0.767755C10.7916 -0.208556 9.20865 -0.208555 8.23234 0.767756L0.767877 8.23222C-0.208434 9.20853 -0.208432 10.7914 0.767878 11.7678L8.23234 19.2322C9.20865 20.2085 10.7916 20.2085 11.7679 19.2322L19.2323 11.7678C20.2087 10.7914 20.2087 9.20853 19.2323 8.23222L11.7679 0.767755ZM9.00005 5.99999C9.00005 5.4477 9.44776 4.99999 10 4.99999C10.5523 4.99999 11 5.4477 11 5.99999V9.99999C11 10.5523 10.5523 11 10 11C9.44776 11 9.00005 10.5523 9.00005 9.99999V5.99999ZM11 14C11 14.5523 10.5523 15 10 15C9.44776 15 9.00005 14.5523 9.00005 14C9.00005 13.4477 9.44776 13 10 13C10.5523 13 11 13.4477 11 14Z"
                    fill="#D72C0D"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_11_589">
                    <rect width="20" height="20" fill="white" />
                  </clipPath>
                </defs>
              </svg>

              <span className="text-[12px] font-[500] text-[#D72C0D]">
                {accountError}
              </span>
            </div>

            <div className="cursor-pointer" onClick={handleErrorClear}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11.2929 3.29289C11.6834 2.90237 12.3166 2.90237 12.7071 3.29289C13.0976 3.68342 13.0976 4.31658 12.7071 4.70711L9.41421 8L12.7071 11.2929C13.0976 11.6834 13.0976 12.3166 12.7071 12.7071C12.3166 13.0976 11.6834 13.0976 11.2929 12.7071L8 9.41421L4.70711 12.7071C4.31658 13.0976 3.68342 13.0976 3.29289 12.7071C2.90237 12.3166 2.90237 11.6834 3.29289 11.2929L6.58579 8L3.29289 4.70711C2.90237 4.31658 2.90237 3.68342 3.29289 3.29289C3.68342 2.90237 4.31658 2.90237 4.70711 3.29289L8 6.58579L11.2929 3.29289Z"
                  fill="#D72C0D"
                />
              </svg>
            </div>
          </div>
        )}

        {loading && (
          <div
            aria-label="Loading..."
            data-testid="Loading"
            className="mt-[150px] flex h-auto w-full flex-col items-center justify-center gap-[19.8px]"
          >
            loading...
          </div>
        )}

        {error && wallets.length === 0 && (
          <div className="mt-[200px] flex h-auto w-full flex-col items-center justify-center gap-[19.8px]">
            <img src={ExpiredImage} alt="logo" />
            <span className="text-[16px] font-[500] text-[#D72C0D]">
              {error}
            </span>
            <button
              onClick={fetchWallets}
              className="h-[54px] w-[180px] rounded-full bg-black text-white"
            >
              Try again
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default AddWallet;
