import { useParams } from "react-router-dom";
import PhotoUploader from "./PhotoUploader";

export default function AddPhotos() {
  const { invitationId } = useParams();

  return (
    <div className="add-photos-wrapper">
      <div className="add-photos-card">

        <h1 className="add-title">Guest — Add Photos</h1>
        <h2 className="add-subtitle">Share Wedding Photos</h2>
        <p className="add-description">
          Upload your favorite moments for the couple!
        </p>

        {/* Your real uploader */}
        <div className="add-form">
          <PhotoUploader invitationId={invitationId} />
        </div>

      </div>
    </div>
  );
}
