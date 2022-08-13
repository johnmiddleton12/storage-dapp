export const connectWallet = async () => {
    if (window.ethereum) {
        try {
            const addressArray = await window.ethereum.request({
                method: "eth_requestAccounts",
            });
            const obj = {
                address: addressArray[0],
            };
            return obj;
        } catch (err) {
            return {
                address: "",
            };
        }
    } else {
        return {
            address: "",
        };
    }
};

// Check if wallet is connected on load
export const getCurrentWalletConnected = async () => {
    if (window.ethereum) {
        try {
            // fetch addresses in injected web3 provider
            const addressArray = await window.ethereum.request({
                method: "eth_accounts",
            });
            // fetch chainId of injected web3 provider
            const chainId = await window.ethereum.request({
                method: "eth_chainId",
            });

            if (addressArray.length > 0) {
                if (parseInt(chainId, 16) === 1) {
                    return {
                        address: addressArray[0],
                        chain: chainId,
                    };
                } else {
                    return {
                        address: addressArray[0],
                        chain: chainId,
                    };
                }
            } else {
                return {
                    address: "",
                    chain: 0,
                };
            }
        } catch (err) {
            return {
                address: "",
                chain: 0,
            };
        }
    } else {
        return {
            address: "",
            chain: 0,
        };
    }
};
