import { useParams } from "react-router-dom";
import ParkingForm from "./ParkingForm";

export default function ParkingCapacity() {
  const { invitationId } = useParams(); // route: /invite/:invitationId/parking

  return (
    <div className="container">
      <h1>Guest — Parking Capacity</h1>
      <p className="muted">Invitation ID: {invitationId}</p>
      <ParkingForm invitationId={invitationId} />
    </div>
  );
}

