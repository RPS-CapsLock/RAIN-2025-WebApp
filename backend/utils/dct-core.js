const N = 8;
const PI = Math.PI;
const SQRT2 = Math.sqrt(2);

const ZIGZAG_INDICES = [
   0,  1,  8, 16,  9,  2,  3, 10,
  17, 24, 32, 25, 18, 11,  4,  5,
  12, 19, 26, 33, 40, 48, 41, 34,
  27, 20, 13,  6,  7, 14, 21, 28,
  35, 42, 49, 56, 57, 50, 43, 36,
  29, 22, 30, 31, 38, 45, 52, 58,
  63, 59, 53, 46, 39, 47, 54, 60,
  61, 55, 62, 63
];

function computeFDCT(block) {
    const dctBlock = new Float32Array(64);
    for (let u = 0; u < 8; u++) {
        for (let v = 0; v < 8; v++) {
            const Cu = (u === 0) ? (1.0 / SQRT2) : 1.0;
            const Cv = (v === 0) ? (1.0 / SQRT2) : 1.0;
            let sum = 0.0;
            for (let x = 0; x < 8; x++) {
                for (let y = 0; y < 8; y++) {
                    sum += block[x * 8 + y] * Math.cos(((2 * x + 1) * u * PI) / 16.0) * Math.cos(((2 * y + 1) * v * PI) / 16.0);
                }
            }
            dctBlock[u * 8 + v] = 0.25 * Cu * Cv * sum;
        }
    }
    return dctBlock;
}

function computeIDCT(dctBlock) {
    const block = new Float32Array(64);
    for (let x = 0; x < 8; x++) {
        for (let y = 0; y < 8; y++) {
            let sum = 0.0;
            for (let u = 0; u < 8; u++) {
                for (let v = 0; v < 8; v++) {
                    const Cu = (u === 0) ? (1.0 / SQRT2) : 1.0;
                    const Cv = (v === 0) ? (1.0 / SQRT2) : 1.0;
                    sum += Cu * Cv * dctBlock[u * 8 + v] * Math.cos(((2 * x + 1) * u * PI) / 16.0) * Math.cos(((2 * y + 1) * v * PI) / 16.0);
                }
            }
            block[x * 8 + y] = 0.25 * sum;
        }
    }
    return block;
}

class BitWriter {
    constructor() {
        this.bytes = [];
        this.currentByte = 0;
        this.bitPosition = 0;
    }
    writeBit(bit) {
        this.currentByte = (this.currentByte << 1) | (bit & 1);
        this.bitPosition++;
        if (this.bitPosition === 8) {
            this.bytes.push(this.currentByte);
            this.currentByte = 0;
            this.bitPosition = 0;
        }
    }
    writeBits(value, n) {
        for (let i = n - 1; i >= 0; i--) this.writeBit((value >> i) & 1);
    }
    writeSigned(value, n) {
        if (n <= 0) return;
        const signBit = (value < 0) ? 1 : 0;
        const absValue = Math.abs(value);
        this.writeBit(signBit);
        for (let i = n - 2; i >= 0; i--) this.writeBit((absValue >> i) & 1);
    }
    getBuffer() {
        if (this.bitPosition > 0) this.bytes.push(this.currentByte << (8 - this.bitPosition));
        return Buffer.from(this.bytes);
    }
}

class BitReader {
    constructor(uint8Array) {
        this.data = uint8Array;
        this.byteIndex = 0;
        this.currentByte = 0;
        this.bitPosition = 8;
    }
    readBit() {
        if (this.bitPosition === 8) {
            this.currentByte = this.data[this.byteIndex++];
            this.bitPosition = 0;
        }
        return (this.currentByte >> (7 - this.bitPosition++)) & 1;
    }
    readBits(n) {
        let v = 0;
        for (let i = 0; i < n; i++) v = (v << 1) | this.readBit();
        return v;
    }
    readSigned(n) {
        if (n <= 0) return 0;
        const sign = this.readBit();
        let abs = 0;
        for (let i = 0; i < n - 1; i++) abs = (abs << 1) | this.readBit();
        return sign === 1 ? -abs : abs;
    }
}

function bitLengthForValue(value) {
    let absVal = Math.abs(value);
    if (absVal === 0) return 0;
    let len = 0;
    while (absVal > 0) { len++; absVal >>= 1; }
    return len + 1;
}

module.exports = { computeFDCT, computeIDCT, BitWriter, BitReader, ZIGZAG_INDICES, bitLengthForValue };