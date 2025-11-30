import { useParams } from "react-router-dom";
import ParkingForm from "./ParkingForm";

export default function ParkingCapacity() {
  const { invitationId } = useParams();

  return (
    // Re-use the same wrapper & card style as the Add Photos page
    <div className="add-photos-wrapper">
      <div className="add-photos-card">
        {/* No big title, no Invitation ID text */}
        <ParkingForm invitationId={invitationId} />
      </div>
    </div>
  );
}
