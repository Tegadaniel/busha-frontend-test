import React, { useState, useEffect } from "react";
import ExpiredImage from "./assets/images/link-expired.png";
import Group from "./assets/images/group.png";
import Loader from "./components/shared/Loader";
import AddWallet from "./AddWallet";

interface Account {
  id: string;
  name: string;
  type: string;
  imgURL: string;
  deposit: boolean;
  payout: boolean;
  pending_balance: string;
  balance: string;
  currency: string;
}

const AccountList = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const handleOpen = () => {
    setIsOpen(true);
  };
  const handleClose = () => {
    setIsOpen(!isOpen);
  };

  async function fetchAccounts() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:3090/accounts");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data: Account[] = await response.json();
      setAccounts(data);
    } catch (err) {
      setError("Network Error: Unable to fetch accounts.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let isMounted = true;

    new Promise((resolve, reject) => {
      fetch("http://localhost:3090/accounts")
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data: Account[]) => {
          if (isMounted) {
            resolve(data); 
          }
        })
        .catch((err) => {
          if (isMounted) {
            reject("Network Error: Unable to fetch accounts.");
          }
        });
    })
      .then((data) => {
        if (isMounted) {
          setAccounts(data as Account[]);
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

     
    return () => {
      isMounted = false;
    };
  }, []);


  return (
    <>
      <div className="flex h-full w-full flex-col gap-3">
        <div className="flex w-full items-center justify-between border-b border-[#D3D5D880] text-center">
          <h4 className="text-[32px] font-[700]">Wallets</h4>
          <span
            onClick={handleOpen}
            className="cursor-pointer text-[16px] font-[500]"
          >
            + Add new wallet
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {accounts.map((account) => (
            <div
              className="flex h-[150px] w-[240px] flex-col gap-4 rounded-[10px] bg-[#111111] px-4 py-3"
              key={account.id}
            >
              <div className="flex flex-col justify-start gap-3">
                <div className="flex gap-3">
                  <img
                    width={34}
                    height={34}
                    src={account.imgURL}
                    alt={account.name}
                  />
                  <span className="text-[14px] font-[400] text-[#9AA5B1]">
                    {account.name}
                  </span>
                </div>
                <span className="text-[16px] font-[500] text-white">
                  {account.balance}
                </span>
              </div>

              <div className="flex items-center justify-end">
                <img src={Group} alt={account.name} />
              </div>
            </div>
          ))}
        </div>
        <div>
          {loading && (
            <div className="mt-[150px] flex h-auto w-full flex-col items-center justify-center gap-[19.8px]">
              <Loader size={50} width={4} />
            </div>
          )}
          {error && (
            <div className="mt-[150px] flex h-auto w-full flex-col items-center justify-center gap-[19.8px]">
              <img src={ExpiredImage} alt="loExpiredImagego" />
              <span className="text-[18px] font-[400] text-[#3E4C59]">
                {" "}
                {error}
              </span>
              <button
                onClick={fetchAccounts}
                className="h-[54px] w-[180px] rounded-full bg-black text-white"
              >
                Try again
              </button>
            </div>
          )}
        </div>
      </div>
      <AddWallet isOpen={isOpen} onClose={handleClose} />
    </>
  );
};

export default AccountList;
