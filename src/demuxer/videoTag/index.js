import H264 from './h264';

export default class VideoTag {
    constructor(flv) {
        this.flv = flv;
        this.h264 = new H264(flv);
    }

    demuxer(tag, requestMeta) {
        const { debug } = this.flv;
        const { codecID } = this.getVideoMeta(tag);
        debug.error(codecID === 7, `[videoTrack] Unsupported codec in video frame: ${codecID}`);
        const { data, meta } = this.h264.demuxer(tag, requestMeta);
        return {
            meta,
            data,
        };
    }

    getVideoMeta(tag) {
        const { debug } = this.flv;
        debug.error(tag.body.length > 1, 'Invalid video packet');
        const meta = tag.body[0];
        return {
            frameType: (meta & 0xf0) >> 4,
            codecID: meta & 0x0f,
        };
    }
}
