package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"math/big"
	"net/http"
	"os"

	"github.com/ethereum-optimism/optimism/op-program/client/mpt"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/common/hexutil"
	"github.com/ethereum/go-ethereum/core/types"
	"github.com/ethereum/go-ethereum/eth/filters"
	"github.com/ethereum/go-ethereum/rlp"
)

func dehash(x string) []byte {
	response, err := http.Get("http://127.0.0.1:5004/get_data/keccak256/" + x)
	if err != nil {
		fmt.Printf("The HTTP request failed with error %s\n", err)
		return nil
	}
	defer response.Body.Close()

	data, _ := ioutil.ReadAll(response.Body)

	return data
}

func get_tx() []byte {
	response, err := http.Get("http://127.0.0.1:5004/get_tx")
	if err != nil {
		fmt.Printf("The HTTP request failed with error %s\n", err)
		return nil
	}
	defer response.Body.Close()

	data, _ := ioutil.ReadAll(response.Body)

	return data
}

func getLatestBlockHash() common.Hash {
	response, err := http.Get("http://127.0.0.1:5004/metadata/espresso-l1-block-hash")
	if err != nil {
		log.Fatalf("The HTTP request failed with error %s\n", err)
	}
	defer response.Body.Close()

	data, _ := ioutil.ReadAll(response.Body)

	return common.BytesToHash(data)
}

func hint(x string) {
	url := "http://127.0.0.1:5004/hint"
	contentType := "application/octet-stream"
	body := bytes.NewReader([]byte(x)) // Convert string to *bytes.Reader

	response, err := http.Post(url, contentType, body)
	if err != nil {
		fmt.Printf("The HTTP request failed with error %s\n", err)
		return
	}
	defer response.Body.Close()

	// Read and print the response body (optional)
	_, err = ioutil.ReadAll(response.Body)
	if err != nil {
		fmt.Printf("Failed to read response body: %s\n", err)
		return
	}
}

func finish(x string) {
	url := "http://127.0.0.1:5004/finish"
	contentType := "application/octet-stream"
	body := bytes.NewReader([]byte(x)) // Convert string to *bytes.Reader

	response, err := http.Post(url, contentType, body)
	if err != nil {
		fmt.Printf("The HTTP request failed with error %s\n", err)
		return
	}
	defer response.Body.Close()

	// Read and print the response body (optional)
	_, err = ioutil.ReadAll(response.Body)
	if err != nil {
		fmt.Printf("Failed to read response body: %s\n", err)
		return
	}
}

// includes returns true if the element is present in the list.
func includes[T comparable](things []T, element T) bool {
	for _, thing := range things {
		if thing == element {
			return true
		}
	}
	return false
}

// filterLogs creates a slice of logs matching the given criteria.
func filterLogs(logs []*types.Log, fromBlock, toBlock *big.Int, addresses []common.Address, topics [][]common.Hash) []*types.Log {
	var check = func(log *types.Log) bool {
		if fromBlock != nil && fromBlock.Int64() >= 0 && fromBlock.Uint64() > log.BlockNumber {
			return false
		}
		if toBlock != nil && toBlock.Int64() >= 0 && toBlock.Uint64() < log.BlockNumber {
			return false
		}
		if len(addresses) > 0 && !includes(addresses, log.Address) {
			return false
		}
		// If the to filtered topics is greater than the amount of topics in logs, skip.
		if len(topics) > len(log.Topics) {
			return false
		}
		for i, sub := range topics {
			if len(sub) == 0 {
				continue // empty rule set == wildcard
			}
			if !includes(sub, log.Topics[i]) {
				return false
			}
		}
		return true
	}
	var ret []*types.Log
	for _, log := range logs {
		if check(log) {
			ret = append(ret, log)
		}
	}
	return ret
}

type JsonRpcRequest struct {
	Jsonrpc string           `json:"jsonrpc"`
	Method  string           `json:"method"`
	Params  json.RawMessage  `json:"params"` // RawMessage for flexibility
	ID      *json.RawMessage `json:"id"`     // Pointer to allow for null
}

type JsonRpcResponse struct {
	Jsonrpc string           `json:"jsonrpc"`
	Result  interface{}      `json:"result,omitempty"`
	Error   *RpcError        `json:"error,omitempty"`
	ID      *json.RawMessage `json:"id"` // Consistent with request ID type
}

type RpcError struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
}

func jsonRpcHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "Error reading request body", http.StatusInternalServerError)
		return
	}

	var request JsonRpcRequest
	if err := json.Unmarshal(body, &request); err != nil {
		http.Error(w, "Error parsing JSON request", http.StatusBadRequest)
		return
	}

	// Example processing logic for a specific method
	var response JsonRpcResponse
	response.Jsonrpc = "2.0"
	response.ID = request.ID // Echo back the request ID

	switch request.Method {
	case "eth_blockNumber":
		response.Result = hexutil.EncodeBig(getBlockByHash(getLatestBlockHash().Hex()[2:]).Number)
		break
	case "eth_getBlockByNumber":
		{
			var req []interface{}

			err := json.Unmarshal(request.Params, &req)
			if err != nil {
				http.Error(w, "Error parsing JSON params", http.StatusBadRequest)
				return
			}

			if len(req) != 2 {
				http.Error(w, "Wrong length", http.StatusBadRequest)
				return
			}

			str, okStr := req[0].(string)
			_, okBool := req[1].(bool)
			if !okStr || !okBool {
				http.Error(w, "Error parsing array", http.StatusBadRequest)
				return
			}
			blockNumber, err := hexutil.DecodeBig(str)

			_, response.Result = getBlockByNumber(blockNumber)
			break
		}
	case "eth_getBlockByHash":
		{
			var req []interface{}

			err := json.Unmarshal(request.Params, &req)
			if err != nil {
				http.Error(w, "Error parsing JSON params", http.StatusBadRequest)
				return
			}

			if len(req) != 2 {
				http.Error(w, "Wrong length", http.StatusBadRequest)
				return
			}

			str, okStr := req[0].(string)
			_, okBool := req[1].(bool)
			if !okStr || !okBool {
				http.Error(w, "Error parsing array", http.StatusBadRequest)
				return
			}

			response.Result = getBlockByHash(str[2:])
			break
		}
	case "eth_getLogs":
		var rawFilters []json.RawMessage
		if err := json.Unmarshal(request.Params, &rawFilters); err != nil {
			http.Error(w, "Error parsing JSON rawFilters", http.StatusBadRequest)
			return
		}
		var logsReturned []*types.Log = make([]types.Log, 0)
		for _, rawFilter := range rawFilters {
			var filter filters.FilterCriteria
			err := filter.UnmarshalJSON(rawFilter)
			if err != nil {
				http.Error(w, "Error parsing JSON filter", http.StatusBadRequest)
				return
			}
			if filter.FromBlock != nil || filter.ToBlock != nil {
				http.Error(w, "Filter fromBlock, toBlock not supported", http.StatusBadRequest)
				return
			}
			if filter.BlockHash == nil {
				http.Error(w, "Filter blockHash missing", http.StatusBadRequest)
				return
			}
			logs := extractLogsFromBlock(filter.BlockHash.Hex()[2:])
			logs = filterLogs(logs, nil, nil, filter.Addresses, filter.Topics)
			logsReturned = append(logsReturned, logs...)
		}
		response.Result = logsReturned
		break
	default:
		response.Error = &RpcError{Code: -32601, Message: "Method not found"}
	}

	responseBytes, err := json.Marshal(response)
	if err != nil {
		http.Error(w, "Error creating response", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(responseBytes)
}

var blockHashCache = make(map[*big.Int]types.Header)

func getBlockByHash(hexBlockHash string) types.Header {
	hint("l1-block-header 0x" + hexBlockHash)
	blockHeader := dehash(hexBlockHash)

	var header types.Header

	err := rlp.DecodeBytes(blockHeader, &header)
	if err != nil {
		log.Fatalf("Failed to decode block header: %v", err)
	}
	blockHashCache[header.Number] = header
	return header
}

func getBlockByNumber(number *big.Int) (string, types.Header) {
	currentBlockHash := getLatestBlockHash().Hex()[2:]

	for {
		block := getBlockByHash(currentBlockHash)

		if block.Number.Cmp(number) == 0 {
			return currentBlockHash, block
		}
		if block.Number.Cmp(number) == -1 {
			log.Fatalf("Invalid block number\n")
		}
		currentBlockHash = block.ParentHash.Hex()[2:]
	}
}

func extractLogsFromBlock(hexBlockHash string) []*types.Log {
	var ret []*types.Log

	header := getBlockByHash(hexBlockHash)
	hint("l1-transactions 0x" + hexBlockHash)

	results := mpt.ReadTrie(common.HexToHash(header.TxHash.Hex()), func(key common.Hash) []byte {
		return dehash(key.Hex()[2:])
	})

	tx_hashes := make([]common.Hash, len(results))
	for count, element := range results {
		var tx types.Transaction
		err := tx.UnmarshalBinary(element)
		if err != nil {
			fmt.Printf("Failed to decode\n")
		}
		tx_hashes[count] = tx.Hash()
	}

	hint("l1-receipts 0x" + hexBlockHash)

	results = mpt.ReadTrie(common.HexToHash(header.ReceiptHash.Hex()), func(key common.Hash) []byte {
		return dehash(key.Hex()[2:])
	})

	for count, element := range results {
		receipt := &types.Receipt{}

		err := receipt.UnmarshalBinary(element)
		if err != nil {
			fmt.Printf("Failed to decode\n")
		}

		for count1, log := range receipt.Logs {
			log.Index = uint(count1)
			log.TxIndex = uint(count)
			log.BlockNumber = header.Number.Uint64()
			log.BlockHash = common.HexToHash("0x" + hexBlockHash)
			log.TxHash = tx_hashes[count]
			ret = append(ret, log)
		}
	}
	return ret
}

func main() {
	http.HandleFunc("/", jsonRpcHandler)
	fmt.Println("Server is listening on port 8545...")
	f, _ := os.Create("/tmp/main.pid")
	defer f.Close()
	if err := http.ListenAndServe(":8545", nil); err != nil {
		fmt.Printf("Failed to start server: %v\n", err)
	}
}
