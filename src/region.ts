import { CoreIndex, Timeslice, Balance, Percentage, ContextData, countMaskOnes } from '.';

export type OnChainRegionId = {
  // The timeslice at which the region starts.
  begin: Timeslice;
  // The index of the relay chain Core on which this Region will be scheduled.
  core: CoreIndex;
  // The regularity parts in which this Region will be scheduled.
  mask: string;
};

export type RegionId = {
  // The timeslice at which the region starts.
  begin: Timeslice;
  // The index of the relay chain Core on which this Region will be scheduled.
  core: CoreIndex;
  // The regularity parts in which this Region will be scheduled.
  mask: string;
};

export type RegionRecord = {
  // The end of the Region.
  end: Timeslice;
  // The owner of the Region.
  owner: string;
  // The amount paid to Polkadot for this Region, or `None` if renewal is not allowed.
  paid: null | Balance;
};

export enum RegionOrigin {
  CORETIME_CHAIN,
  CONTRACTS_CHAIN,
}

export class Region {
  private regionId: RegionId;
  private regionRecord: RegionRecord;

  /**
   * Constructs a new Region instance.
   * @param regionId The unique identifier of the region.
   * @param regionRecord The record details of the region.
   * In case it is not a xc-region, it should be 0.
   */
  constructor(regionId: RegionId, regionRecord: RegionRecord) {
    this.regionId = regionId;
    this.regionRecord = regionRecord;
  }

  /**
   * RegionId of the Region.
   * @returns The RegionId of the current Region instance.
   */
  public getRegionId(): RegionId {
    return this.regionId;
  }

  /**
   * Onchain broker pallet representation of RegionId.
   * @returns The RegionId of the current Region instance.
   */
  public getOnChainRegionId(): OnChainRegionId {
    return {
      begin: this.getBegin(),
      core: this.getCore(),
      mask: this.getMask(),
    };
  }

  /**
   * RegionRecord of the Region.
   * @returns The RegionRecord of the current Region instance.
   */
  public getRegionRecord(): RegionRecord {
    return this.regionRecord;
  }

  /**
   * Gets the beginning timeslice of the region.
   * @returns The starting timeslice.
   */
  public getBegin(): Timeslice {
    return this.regionId.begin;
  }

  /**
   * Gets the core index of the region.
   * @returns The core index.
   */
  public getCore(): CoreIndex {
    return this.regionId.core;
  }

  /**
   * Gets the mask for the region scheduling.
   * @returns The core mask.
   */
  public getMask(): string {
    return this.regionId.mask;
  }

  /**
   * Gets the ending timeslice of the region.
   * @returns The ending timeslice.
   */
  public getEnd(): Timeslice {
    return this.regionRecord.end;
  }

  /**
   * Gets the owner of the region.
   * @returns The owner's identifier.
   */
  public getOwner(): string {
    return this.regionRecord.owner;
  }

  /**
   * Gets the amount paid for the region, or null if renewal is not allowed.
   * @returns The paid balance or null.
   */
  public getPaid(): null | Balance {
    return this.regionRecord.paid;
  }

  /**
   * Calculates the percentage of the region that got consumed so far with the
   * given context.
   * @returns The percentage consumed so far.
   */
  public consumed(context: ContextData): Percentage {
    // rough estimation
    const beginBlockHeight = context.timeslicePeriod * this.getBegin();
    const endBlockHeight = context.timeslicePeriod * this.getEnd();
    const durationInBlocks = endBlockHeight - beginBlockHeight;

    let consumed = (context.relayBlockNumber - beginBlockHeight) / durationInBlocks;
    if (consumed < 0) {
      // This means that the region hasn't yet started.
      consumed = 0;
    }

    return consumed;
  }

  /**
   * @returns The percentage of a core's resources that the region 'occupies'
   */
  public coreOccupancy(): Percentage {
    return countMaskOnes(this.getMask()) / 80;
  }
}
