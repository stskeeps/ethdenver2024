import { Address } from "./graph-ts/types";
import * as store from "./graph-ts/store"

export class Gravatar {
  attrs:any = {};

  constructor(id: `0x${string}`) {
    this.attrs.id = id;
  }

  save(): void {
    store.set("Gravatar", this.id, this);
  }

  static load(id: string): Gravatar | null {
    return store.get("Gravatar", id);
  }

  get id(): string {
    return this.attrs.id;
  }

  set id(value: string) {
    this.attrs.id = value;
  }

  get owner(): Address {
    return this.attrs.owner;
  }

  set owner(owner: Address) {
    this.attrs.owner = owner;
  }

  get displayName(): string {
    return this.attrs.displayName;
  }

  set displayName(displayName: string) {
    this.attrs.displayName = displayName;
  }

  get imageUrl(): string {
    return this.attrs.imageUrl;
  }

  set imageUrl(imageUrl: string) {
    this.attrs.imageUrl = imageUrl;
  }
}


// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

// import {
//   TypedMap,
//   Entity,
//   Value,
//   ValueKind,
//   store,
//   Bytes,
//   BigInt,
//   BigDecimal,
// } from "@graphprotocol/graph-ts";

// export class Gravatar extends Entity {
//   constructor(id: string) {
//     super();
//     this.set("id", Value.fromString(id));
//   }

//   save(): void {
//     let id = this.get("id");
//     assert(id != null, "Cannot save Gravatar entity without an ID");
//     if (id) {
//       assert(
//         id.kind == ValueKind.STRING,
//         `Entities of type Gravatar must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`,
//       );
//       store.set("Gravatar", id.toString(), this);
//     }
//   }

//   static loadInBlock(id: string): Gravatar | null {
//     return changetype<Gravatar | null>(store.get_in_block("Gravatar", id));
//   }

//   static load(id: string): Gravatar | null {
//     return changetype<Gravatar | null>(store.get("Gravatar", id));
//   }

//   get id(): string {
//     let value = this.get("id");
//     if (!value || value.kind == ValueKind.NULL) {
//       throw new Error("Cannot return null for a required field.");
//     } else {
//       return value.toString();
//     }
//   }

//   set id(value: string) {
//     this.set("id", Value.fromString(value));
//   }

//   get owner(): Bytes {
//     let value = this.get("owner");
//     if (!value || value.kind == ValueKind.NULL) {
//       throw new Error("Cannot return null for a required field.");
//     } else {
//       return value.toBytes();
//     }
//   }

//   set owner(value: Bytes) {
//     this.set("owner", Value.fromBytes(value));
//   }

//   get displayName(): string {
//     let value = this.get("displayName");
//     if (!value || value.kind == ValueKind.NULL) {
//       throw new Error("Cannot return null for a required field.");
//     } else {
//       return value.toString();
//     }
//   }

//   set displayName(value: string) {
//     this.set("displayName", Value.fromString(value));
//   }

//   get imageUrl(): string {
//     let value = this.get("imageUrl");
//     if (!value || value.kind == ValueKind.NULL) {
//       throw new Error("Cannot return null for a required field.");
//     } else {
//       return value.toString();
//     }
//   }

//   set imageUrl(value: string) {
//     this.set("imageUrl", Value.fromString(value));
//   }
// }
