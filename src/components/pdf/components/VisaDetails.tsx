interface VisaDetailsProps {
  visaType: string;
  validity: string;
  processingDate: string;
}

export function VisaDetails({
  visaType,
  validity,
  processingDate,
}: VisaDetailsProps) {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-black mb-6">
        Visa <span className="text-purple-600">Details</span>
      </h2>

      <div className="border-2 border-gray-300 rounded-lg p-6 mb-8">
        <div className="grid grid-cols-3 gap-6 text-center">
          <div>
            <p className="text-gray-600 text-sm mb-1">Visa Type :</p>
            <p className="text-black font-medium">{visaType}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm mb-1">Validity:</p>
            <p className="text-black font-medium">{validity}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm mb-1">Processing Date :</p>
            <p className="text-black font-medium">{processingDate}</p>
          </div>
        </div>
      </div>

      <div className="text-center">
        <h3 className="text-3xl font-bold text-purple-800 mb-6 tracking-wide">
          PLAN.PACK.GO!
        </h3>
        <button className="bg-purple-700 hover:bg-purple-800 text-white font-semibold px-8 py-3 rounded-full text-lg transition-colors duration-200">
          Book Now
        </button>
      </div>
    </div>
  );
}
