package main
import (
        "os"
        "fmt"
	"github.com/ethereum/go-ethereum/common"
	"bytes"
	"github.com/ethereum-optimism/optimism/op-program/client/mpt"
	"io/ioutil"
	"log"
	"time"
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

func main() {
    hexBlockHash := os.Args[1]
    hint("l1-block-header 0x" + hexBlockHash)
    blockHeader := dehash(hexBlockHash)
    
    var header types.Header
    
    err := rlp.DecodeBytes(blockHeader, &header)
    if err != nil {
        log.Fatalf("Failed to decode block header: %v", err)
    }
    fmt.Printf("{\"parentHash\":\"%s\",\"transactions\":[", header.ParentHash.Hex());
    hint("l1-transactions 0x" + hexBlockHash);  

    results := mpt.ReadTrie(common.HexToHash(header.TxHash.Hex()), func(key common.Hash) []byte {
        return dehash(key.Hex()[2:])
    })
    
    tx_hashes := make ([]common.Hash, len(results))
    for count, element := range results {
        var tx types.Transaction
        err := tx.UnmarshalBinary(element)
        if err != nil {
             fmt.Printf("Failed to decode\n")
        }
        tx_hashes[count] = tx.Hash()
/*        json, err := tx.MarshalJSON()
        if err != nil {
             fmt.Printf("Failed to marshall\n")
        } */
//        fmt.Printf("%s", json)
        if count != len(results) - 1 {
  //        fmt.Printf(",")
        }
    }
    fmt.Printf("],\"receipts\":[")
    hint("l1-receipts 0x" + hexBlockHash);  
    results = mpt.ReadTrie(common.HexToHash(header.ReceiptHash.Hex()), func(key common.Hash) []byte {
        return dehash(key.Hex()[2:])
    })
    
        
    for count, element := range results {
        receipt := &types.Receipt{}
         
        err := receipt.UnmarshalBinary(element)
        if err != nil {
             fmt.Printf("Failed to decode\n");
        }
        
        for count1, log := range receipt.Logs {
          log.Index = uint(count1)
          log.TxIndex = uint(count)
          log.BlockNumber = header.Number.Uint64()
          log.BlockHash = common.HexToHash("0x" + hexBlockHash)
          log.TxHash = tx_hashes[count]
          json, err := log.MarshalJSON()
          if (err != nil) {
          }
          fmt.Printf("%s", json)
          if count1 != len(receipt.Logs) - 1 {
            fmt.Printf(",")
          }
        }
    }
    fmt.Printf("]}\n")
    if os.Args[2] == "1" {
      time.Sleep(8 * time.Second) 
      get_tx()
      finish("")    
    }
}
