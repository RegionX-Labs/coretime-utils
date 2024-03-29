import { BN } from '@polkadot/util';

export type Percentage = number; // Percentage value between 0 and 1

export type Timeslice = number;

export type MetadataVersion = number;

// Index of a Polkadot Core.
export type CoreIndex = number;

// A Task Id. In general this is called a ParachainId.
export type TaskId = number;

export type Balance = number;

// `RegionId` encoded into a BigNumber (BN).
export type RawRegionId = BN;

export type ContextData = {
  timeslicePeriod: number;
  relayBlockNumber: number;
};

export const Id = {
  _enum: {
    U8: 'u8',
    U16: 'u16',
    U32: 'u32',
    U64: 'u64',
    U128: 'u128',
  },
};
