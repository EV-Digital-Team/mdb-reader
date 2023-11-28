import { jet4Format } from "./Jet4Format.js";
import { CodecType, type JetFormat } from "./types.js";

export const jet12Format: JetFormat = {
    ...jet4Format,
    codecType: CodecType.OFFICE,
};
