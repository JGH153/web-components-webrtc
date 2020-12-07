import { WebRTCService } from "../services/webrtc.service";

export const RoomRouterGuard = () => {
  // const webRTCService = new WebRTCService();
  // if (!webRTCService.getRoomId()) {
  //   window.location.href = window.location.protocol + "//" + window.location.host;
  //   return false;
  // }
  return true;
};
