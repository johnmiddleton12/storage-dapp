import { Icon, Typography } from "@mui/material";
import { useEffect, useState } from "react";

import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import CheckIcon from '@mui/icons-material/Check';

// takes in transaction objects and returns a div of a list of them, tracking when complete and
// offering retry option upon failure
// TODO: setTransactions, provider necessary?
// maybe add X button to remove transaction from visible list
export default function TransactionTracker({ transactions, setTransactions, provider }) {

    const [transactionPromises, setTransactionPromises] = useState([]);

    // hash -> promise
    const [transactionPromisesDict, setTransactionPromisesDict] = useState({});

    useEffect(() => {
        if (provider !== null) {
            for (let i = 0; i < transactions.length; i++) {
                if (!transactionPromisesDict[transactions[i].hash] && transactionPromisesDict[transactions[i].hash] !== "done") {
                    let transactionPromise = transactions[i].wait().then(result => {
                        console.log(result);

                        for (let j = 0; j < transactions.length; j++) {
                            if (transactions[j].hash === result.transactionHash) {
                                // let newTransactions = transactions.slice();
                                // newTransactions.pop(j);
                                let copyDict = { ...transactionPromisesDict, [transactions[j].hash]: "done" };
                                setTransactionPromisesDict(copyDict);
                                // setTransactions(newTransactions);
                                console.log('Removing Transaction: ' + result.transactionHash + " from transactions dict");
                            }
                        }
                        console.log('Promises: ' + transactionPromises);
                        console.log('Transactions: ' + transactions);

                    }).catch(error => {
                        console.log(error);
                    });
                    console.log("Transaction Promise:", transactionPromise);

                    transactionPromisesDict[transactions[i].hash] = transactionPromise;
                    setTransactionPromises(transactionPromises => [...transactionPromises, transactionPromise]);
                    console.log("Adding Transaction Promise:", transactionPromises);
                }
            }
        }
    }
        , [transactions]);


    return (
        <div>

            <Typography variant="h6">
                Transactions
            </Typography>

            <ul>
                {transactions.map((transaction, index) => {
                    return (
                        <li key={index}>

                                <a href={`https://polygonscan.com/tx/${transaction.hash}`} target="_blank">
                                    {transaction.hash.toString()}
                                </a>

                            {transactionPromisesDict[transaction.hash] !== "done" ? <HourglassBottomIcon /> : <CheckIcon />}
                        </li>
                    );
                }
                )}
            </ul>

        </div>
    );
}