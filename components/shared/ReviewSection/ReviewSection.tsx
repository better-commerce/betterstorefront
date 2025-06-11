import { CURRENT_THEME } from "@components/utils/constants";

interface TrustpilotRatingProps {
  score?: number;
  reviewCount?: number;
  className?: string;
}

const TrustpilotRating = ({
  score = 4.9,
  reviewCount = 16371,
  className = "",
}: TrustpilotRatingProps) => {
  return (
    <div className={`inline-flex flex-col items-start space-y-4 ${className}`}>
      {/* Trustpilot Logo */}
      <div className="flex items-center space-x-2">
        <img
          src={`/theme/${CURRENT_THEME}/image/trustpilot-img.png`}
          alt="Trustpilot Logo"
          className="h-[80px]"
        />
      </div>

      {/* Trust Score */}
      <div className="space-y-1">
        <div className="text-base font-medium text-foreground">
          TrustScore <span className="font-bold">{score}</span>
        </div>
        <div className="text-base font-medium text-foreground">
          <span className="font-bold">{reviewCount.toLocaleString()}</span> reviews
        </div>
      </div>
    </div>
  );
};

export default TrustpilotRating;
