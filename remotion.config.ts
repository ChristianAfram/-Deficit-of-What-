import {Config} from '@remotion/cli/config';

Config.setVideoImageFormat('png');
Config.setPixelFormat('yuv420p');
Config.setCodec('h264');
// The film is fine type and hairlines on a flat ground, held still for
// seconds at a time. At a higher CRF the encoder's keyframes show: the noise
// around the type changes on one frame, inside a hold that must not move.
Config.setCrf(10);
Config.setX264Preset('slow');
Config.setOverwriteOutput(true);
