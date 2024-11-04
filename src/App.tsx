import React from "react";
import styled from "styled-components";
import Logo from "../src/assets/images/Busha-Logo.png";
import AccountList from "./AccountList";

const SidebarItem = styled.div<{ isactive?: boolean }>`
  padding: 10px 16px;
  background-color: ${({ isactive }) => (isactive ? "#F5F7FA" : "transparent")};
  color: black; /* Set text color to black */
  cursor: pointer;
  &:hover {
    background-color: #f5f7fa;
  }
`;
const App = () => {
  const sidebarLinks = [
    "Wallets",
    "Prices",
    "Peer2Peer",
    "Activity",
    "Settings",
  ];
  return (
    <>
      <div className="flex h-full w-full flex-col gap-0">
        <header
          style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.15)" }}
          className="border-box flex h-[56px] w-full items-center justify-between px-[95px]"
        >
          <div className="block">
            <img src={Logo} alt="logo" />
          </div>
          <div className="flex items-center gap-[8px] text-[16px] font-[500]">
            <div className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-[#9aa5b14d] text-[#3e4c59]">
              O
            </div>
            <span>Oluwatobi Akindunjoye</span>
          </div>
        </header>
        <div className="flex gap-[50px] px-[230px] py-[60px]">
          <div className="flex h-[222px] w-[240px] basis-[20%] flex-col gap-0">
            {sidebarLinks.map((link, index) => (
              <SidebarItem key={link} isactive={index === 0}>
                {link}
              </SidebarItem>
            ))}
          </div>
          <div className="h-full w-full basis-[80%]">
            <AccountList />
          </div>
        </div>
      </div>
      {/* <AccountList /> */}
      <div id="modal-root"></div>
    </>
  );
};

export default App;
