const sharp = require('sharp');
const { computeFDCT, BitWriter, ZIGZAG_INDICES, bitLengthForValue } = require('./dct-core');

async function compressImage(inputPath, outputPath, factor) {
    const { data, info } = await sharp(inputPath).removeAlpha().raw().toBuffer({ resolveWithObject: true });
    const { width, height } = info;
    const pW = Math.ceil(width / 8) * 8;
    const pH = Math.ceil(height / 8) * 8;
    const writer = new BitWriter();

    for (let r = 0; r < pH; r += 8) {
        for (let c = 0; c < pW; c += 8) {
            for (let ch = 0; ch < 3; ch++) {
                const block = new Float32Array(64);
                for (let x = 0; x < 8; x++) {
                    for (let y = 0; y < 8; y++) {
                        if (r + x < height && c + y < width) {
                            block[x * 8 + y] = data[((r + x) * width + (c + y)) * 3 + ch] - 128;
                        }
                    }
                }
                const dct = computeFDCT(block);
                const zig = new Int32Array(64);
                for (let i = 0; i < 64; i++) zig[i] = Math.round(dct[ZIGZAG_INDICES[i]]);
                const keep = Math.max(1, 64 - factor);
                for (let i = keep; i < 64; i++) zig[i] = 0;

                writer.writeSigned(zig[0], 12);
                let i = 1, zL = 0;
                while (i < 64) {
                    if (zig[i] === 0) {
                        zL++; i++;
                        if (i === 64) { writer.writeBit(0); writer.writeBits(zL, 6); }
                    } else {
                        const bL = bitLengthForValue(zig[i]);
                        writer.writeBit(zL > 0 ? 0 : 1);
                        if (zL > 0) { writer.writeBits(zL, 6); writer.writeBits(bL, 4); }
                        else { writer.writeBits(bL, 4); }
                        writer.writeSigned(zig[i], bL);
                        zL = 0; i++;
                    }
                }
            }
        }
    }
    const header = Buffer.alloc(12);
    header.writeInt32LE(width, 0);
    header.writeInt32LE(height, 4);
    header.writeInt32LE(factor, 8);
    require('fs').writeFileSync(outputPath, Buffer.concat([header, writer.getBuffer()]));
}

module.exports = { compressImage };