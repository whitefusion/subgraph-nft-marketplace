import { Address, BigInt } from "@graphprotocol/graph-ts";
import {
  ItemBought as ItemBoughtEvent,
  ItemCancelled as ItemCancelledEvent,
  ItemListed as ItemListedEvent,
} from "../generated/NftMarketplace/NftMarketplace";
import {
  ItemBought,
  ItemCancelled,
  ItemListed,
  ActiveItem,
} from "../generated/schema";

export function handleItemBought(event: ItemBoughtEvent): void {
  const tokenId = event.params.tokenId;
  const nftAddress = event.params.nftAddress;

  let entity = ItemBought.load(getIdFromEventParams(tokenId, nftAddress));
  let activeEntity = ActiveItem.load(getIdFromEventParams(tokenId, nftAddress));
  if (!entity) {
    entity = new ItemBought(getIdFromEventParams(tokenId, nftAddress));
  }
  entity.buyer = event.params.buyer;
  entity.nftAddress = event.params.nftAddress;
  entity.tokenId = event.params.tokenId;
  entity.price = event.params.price;

  activeEntity!.buyer = event.params.buyer;

  entity.save();
  activeEntity!.save();
}

export function handleItemCancelled(event: ItemCancelledEvent): void {
  const tokenId = event.params.tokenId;
  const nftAddress = event.params.nftAddress;

  let entity = ItemCancelled.load(getIdFromEventParams(tokenId, nftAddress));
  let activeEntity = ActiveItem.load(getIdFromEventParams(tokenId, nftAddress));

  if (!entity) {
    entity = new ItemCancelled(getIdFromEventParams(tokenId, nftAddress));
  }

  entity.seller = event.params.seller;
  entity.nftAddress = event.params.nftAddress;
  entity.tokenId = event.params.tokenId;

  activeEntity!.buyer = Address.fromString(
    "0x000000000000000000000000000000000000dEaD"
  );

  entity.save();
  activeEntity!.save();
}

export function handleItemListed(event: ItemListedEvent): void {
  const tokenId = event.params.tokenId;
  const nftAddress = event.params.nftAddress;

  let entity = ItemListed.load(getIdFromEventParams(tokenId, nftAddress));
  let activeEntity = ActiveItem.load(getIdFromEventParams(tokenId, nftAddress));
  if (!entity) {
    entity = new ItemListed(getIdFromEventParams(tokenId, nftAddress));
  }
  if (!activeEntity) {
    activeEntity = new ActiveItem(getIdFromEventParams(tokenId, nftAddress));
  }
  entity.sender = event.params.sender;
  entity.nftAddress = event.params.nftAddress;
  entity.tokenId = event.params.tokenId;
  entity.price = event.params.price;

  activeEntity.seller = event.params.sender;
  activeEntity.nftAddress = event.params.nftAddress;
  activeEntity.tokenId = event.params.tokenId;
  activeEntity.price = event.params.price;

  activeEntity.buyer = Address.fromString(
    "0x0000000000000000000000000000000000000000"
  );

  entity.save();
  activeEntity.save();
}

function getIdFromEventParams(tokenId: BigInt, nftAddress: Address): string {
  return tokenId.toHexString() + nftAddress.toHexString();
}
