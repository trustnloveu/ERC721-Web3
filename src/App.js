import { useEffect, useState } from "react";

import Web3 from "web3";
import UNFT from "./truffle_abis/UNFT.json";

import "./App.css";

function App() {
  //* 토큰 컨트렉트
  const [tokenContract, setTokenContract] = useState({});

  //* 토큰 정보
  const [tokenName, setTokenName] = useState(""); // 토큰 URI
  const [tokenSymbol, setTokenSymbol] = useState(""); // 토큰 URI
  const [tokenURI, setTokenURI] = useState(""); // 토큰 URI

  //* 토큰 리스트
  const [tokenList, setTokenList] = useState([]);

  //* 계정 정보
  const [account, setAccount] = useState("");
  const [tokenBalance, setTokenBalance] = useState(0);

  //* Load Web3
  const loadWeb3 = async () => {
    // window.web3 = new Web3("http://211.54.150.66:18545");
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3.personal) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      alert("메타마스크 연동이 확인되지 않습니다.");
    }
  };

  //* Load Data
  const loadBlockchainData = async () => {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    const networkId = await web3.eth.net.getId();

    setAccount(accounts[0]);

    // set Tether
    const nftData = UNFT.networks[networkId];

    if (nftData) {
      const nftContract = new web3.eth.Contract(UNFT.abi, nftData.address);

      const test = await nftContract.methods.tokenURI(3).call();
      console.log(test);

      const tokenName = await nftContract.methods.name().call();
      const tokenSymbol = await nftContract.methods.symbol().call();
      const accountBalance = await nftContract.methods
        .balanceOf(accounts[0])
        .call();

      setTokenName(tokenName);
      setTokenSymbol(tokenSymbol);
      setTokenBalance(accountBalance);
      setTokenContract(nftContract);

      // console.log("======== NFT 컨트렉트 정보 ========");
      // console.log(nftContract);
      // console.log("================================");
    }
  };

  //* useEffect
  useEffect(() => {
    loadWeb3();
    loadBlockchainData();
  }, []);

  //* 토큰 URI 입력 이벤트
  const tokenUriHandler = (event) => {
    setTokenURI(event.target.value);
  };

  //* 토큰 발행
  const createToken = async () => {
    if (tokenContract) {
      await tokenContract.methods
        .createToken(tokenURI.toString())
        .send({ from: account }) // meg.sender
        .on("transactionHash", (hash) => {
          console.log("Transaction Hash");
          console.log(hash);
          // Nested Function
          // ...
        });
    } else {
      alert("컨트렉트 정보가 없습니다.");
    }
  };

  //* 리스트 출력
  const displayList = async () => {
    if (tokenContract) {
      const tokenList = [];
      const totalSupply = await tokenContract.methods.totalSupply().call();

      if (totalSupply) {
        for (let i = 0; i < totalSupply; i++) {
          const tokenMap = {};

          const tokenId = await tokenContract.methods.tokenByIndex(i).call();

          tokenMap.tokenId = tokenId;
          tokenMap.tokenOwner = await tokenContract.methods
            .ownerOf(tokenId)
            .call();

          tokenList.push(tokenMap);
          console.log(tokenMap);
        }
        setTokenList([...tokenList]);
      }
    }
  };

  //* Return
  return (
    <div className="App">
      <main className="App-main">
        <div className="text-left">
          <div>토큰 이름 : {tokenName}</div>
          <div>토큰 심볼 : {tokenSymbol}</div>
          <div>토큰 수량 : {tokenBalance}</div>
          <div>
            <input
              type="text"
              placeholder="URI 입력"
              value={tokenURI}
              onChange={tokenUriHandler}
            />
            <button onClick={createToken}>토큰발행</button>
          </div>
        </div>
        <section className="token-list">
          <button onClick={displayList}>리스트 보기</button>
          {tokenList.length > 0 &&
            tokenList.map((token) => (
              <li className="text-left" key={token.tokenId}>
                <div>토큰 ID ::: {token.tokenId}</div>
                <div>토큰 소유 주소 ::: {token.tokenOwner}</div>
              </li>
            ))}
        </section>
      </main>
    </div>
  );
}

export default App;
