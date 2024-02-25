package main
import (
        "fmt"
	"github.com/ethereum/go-ethereum/common"
	hexutil "github.com/ethereum/go-ethereum/common/hexutil"
	"bytes"
	"github.com/ethereum-optimism/optimism/op-program/client/mpt"
	"io/ioutil"
	"time"
	"log"
        "net/http"      
        "github.com/ethereum/go-ethereum/core/types"
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
    responseBody, err := ioutil.ReadAll(response.Body)
    if err != nil {
        fmt.Printf("Failed to read response body: %s\n", err)
        return
    }
    fmt.Println("Response:", string(responseBody))
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
    responseBody, err := ioutil.ReadAll(response.Body)
    if err != nil {
        fmt.Printf("Failed to read response body: %s\n", err)
        return
    }
    fmt.Println("Response:", string(responseBody))
}

func main() {
    hint("l1-block-header 0x6e4dd5b03a4fa7b85be4d6bd78bf641cf2fd1de92c8eb9b673c14edd349258d5")
    blockHeader := dehash("6e4dd5b03a4fa7b85be4d6bd78bf641cf2fd1de92c8eb9b673c14edd349258d5")
    
    var header types.Header
    
    err := rlp.DecodeBytes(blockHeader, &header)
    if err != nil {
        log.Fatalf("Failed to decode block header: %v", err)
    }
    fmt.Printf("Block Number: %d\n", header.Number.Uint64())
    fmt.Printf("Parent Hash: %s\n", header.ParentHash.Hex())
    fmt.Printf("Difficulty: %d\n", header.Difficulty.Uint64())
    
    fmt.Printf("ReceiptHash: %s\n", header.ReceiptHash.Hex())
    hint("l1-receipts 0x6e4dd5b03a4fa7b85be4d6bd78bf641cf2fd1de92c8eb9b673c14edd349258d5");  
    results := mpt.ReadTrie(common.HexToHash(header.ReceiptHash.Hex()), func(key common.Hash) []byte {
        return dehash(key.Hex()[2:])
    })
    fmt.Printf("Receipts: %v\n", len(results))
    
    for count, element := range results {
        var tx types.Receipt
        var by []byte = element[1:]
        fmt.Printf("receipt %i - %s\n", count, hexutil.Encode(by))
        err := rlp.DecodeBytes(by, &tx)
        if err != nil {
             fmt.Printf("Failed to decode\n");
        }
        
        fmt.Printf("Status: %v\n", tx.Status)
        for _, log := range tx.Logs {
          fmt.Printf("log address %s\n", log.Address.Hex())
          for _, topic := range log.Topics {
            fmt.Printf("log topic %s\n", topic.Hex())
          }
        }
    }
    hint("l1-transactions 0x6e4dd5b03a4fa7b85be4d6bd78bf641cf2fd1de92c8eb9b673c14edd349258d5");  
    results = mpt.ReadTrie(common.HexToHash(header.TxHash.Hex()), func(key common.Hash) []byte {
        return dehash(key.Hex()[2:])
    })
    fmt.Printf("Transactions: %v\n", len(results))
    
    for count, element := range results {
        var by []byte = element[1:]
        fmt.Printf("tx %i - %s\n", count, hexutil.Encode(by))
    }
    fmt.Printf("Done analyzing")
    time.Sleep(8 * time.Second) 
    get_tx()
    finish("")    
}
