import React, { useEffect, useRef } from 'react';
import { BitReader, computeIDCT, ZIGZAG_INDICES } from '../utils/dct-core';

const DCTImage = ({ binFileUrl }) => {
    const canvasRef = useRef(null);
    useEffect(() => {
        if (!binFileUrl) return;
        (async () => {
            const res = await fetch(binFileUrl);
            const buf = await res.arrayBuffer();
            const view = new DataView(buf);
            const w = view.getInt32(0, true);
            const h = view.getInt32(4, true);
            const reader = new BitReader(new Uint8Array(buf.slice(12)));
            const canvas = canvasRef.current;
            canvas.width = w; canvas.height = h;
            const ctx = canvas.getContext('2d');
            const img = ctx.createImageData(w, h);
            const pW = Math.ceil(w / 8) * 8;
            const pH = Math.ceil(h / 8) * 8;

            for (let r = 0; r < pH; r += 8) {
                for (let c = 0; c < pW; c += 8) {
                    for (let ch = 0; ch < 3; ch++) {
                        const zig = new Int32Array(64);
                        zig[0] = reader.readSigned(12);
                        let idx = 1;
                        while (idx < 64) {
                            if (reader.readBit() === 0) {
                                let zL = reader.readBits(6);
                                if (idx + zL >= 64) { while (idx < 64) zig[idx++] = 0; break; }
                                for (let i = 0; i < zL; i++) zig[idx++] = 0;
                                zig[idx++] = reader.readSigned(reader.readBits(4));
                            } else { zig[idx++] = reader.readSigned(reader.readBits(4)); }
                        }
                        const bF = new Float32Array(64);
                        for (let i = 0; i < 64; i++) bF[ZIGZAG_INDICES[i]] = zig[i];
                        const res = computeIDCT(bF);
                        for (let x = 0; x < 8; x++) {
                            for (let y = 0; y < 8; y++) {
                                if (r + x < h && c + y < w) {
                                    const pI = ((r + x) * w + (c + y)) * 4;
                                    img.data[pI + ch] = res[x * 8 + y] + 128;
                                    img.data[pI + 3] = 255;
                                }
                            }
                        }
                    }
                }
            }
            ctx.putImageData(img, 0, 0);
        })();
    }, [binFileUrl]);
    return <canvas ref={canvasRef} style={{ borderRadius: '50%', border: '2px solid #FF7A00', width: '150px', height: '150px' }} />;
};
export default DCTImage;