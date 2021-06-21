import { fb } from '../config/ConfigFirebase';


class FirebaseSync {
  update_online_status(id,status) {
    fb.ref('/delivery_partners/'+id).update({
      status: status
    });
  }
  update_booking_status(id,booking_id,status) {
    fb.ref('/orders/'+id+'/'+booking_id).update({
      status: status
    });
  }
  update_location(id,location){
    fb.ref('/delivery_partners/'+id).update({
      l: location
    });
  }
}
const fb_lib = new FirebaseSync();
export default fb_lib;