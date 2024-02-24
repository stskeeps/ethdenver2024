package main
import (
        "fmt"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum-optimism/optimism/op-program/client/mpt"
	"io/ioutil"
	"log"
        "net/http"      
        "github.com/ethereum/go-ethereum/core/types"
        "github.com/ethereum/go-ethereum/rlp"
)

func dehash(x string) []byte {
    response, err := http.Get("http://127.0.0.1:8000/dehash/" + x)
    if err != nil {
        fmt.Printf("The HTTP request failed with error %s\n", err)
        return nil
    }
    defer response.Body.Close()

    data, _ := ioutil.ReadAll(response.Body)
    
    return data
}

func hint(x string){
    response, err := http.Get("http://127.0.0.1:8000/hint/" + x)
    if err != nil {
        fmt.Printf("The HTTP request failed with error %s\n", err)
        return
    }
    defer response.Body.Close()
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
        fmt.Printf("receipt %i - %s\n", count, element.String())
        var tx types.Receipt
        var by []byte = element[1:]
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
}
