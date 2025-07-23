import React from "react";

interface PaymentStepProps {
    nextStep: () => void;
    prevStep: () => void;
    paymentInfo: {
        payment_initiated: boolean;
    };
    setPaymentInfo: React.Dispatch<
        React.SetStateAction<{
            payment_initiated: boolean;
        }>
    >;
    errors?: Record<string, string>;
}

const PaymentStep: React.FC<PaymentStepProps> = ({
    nextStep,
    prevStep,
    paymentInfo,
    setPaymentInfo,
    errors,
}) => {
    const handleContinue = () => {
        setPaymentInfo({
            ...paymentInfo,
            payment_initiated: true,
        });
        nextStep();
    };

    // WhatsApp contact number - this should be configured somewhere else in production
    const whatsappNumber = "628123456789"; // Replace with the actual WhatsApp number
    const whatsappMessage = encodeURIComponent(
        "Hi, I would like to send payment proof for Hacksphere registration."
    );
    const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

    return (
        <div>
            <h3 className="text-lg font-semibold text-white mb-4">
                Step 5: Payment
            </h3>
            <p className="text-gray-300 mb-4">
                Please complete your payment to finalize your Hacksphere
                registration.
            </p>

            <div className="bg-gray-700 p-6 rounded-lg mb-6">
                <h4 className="font-semibold text-lg text-white mb-3">
                    Payment Details
                </h4>

                <div className="mb-4">
                    <p className="text-gray-300 mb-2">Registration Fee:</p>
                    <p className="text-white text-2xl font-bold">
                        IDR 150,000{" "}
                        <span className="text-sm font-normal">
                            (per person)
                        </span>
                    </p>
                    <p className="text-amber-400 mt-2">
                        <strong>Important:</strong> Each team member must pay
                        IDR 150,000 individually.
                    </p>
                </div>

                <div className="mb-6">
                    <h5 className="text-white mb-2">Payment Instructions:</h5>
                    <ol className="list-decimal list-inside text-gray-300 space-y-2">
                        <li>Make a payment of IDR 150,000 to our account</li>
                        <li>
                            Take a screenshot or photo of your payment proof
                        </li>
                        <li>
                            Send the proof through WhatsApp using the button
                            below
                        </li>
                        <li>
                            Include your team name and member name in the
                            WhatsApp message
                        </li>
                        <li>
                            Each team member must make a separate payment and
                            send proof individually
                        </li>
                        <li>
                            After sending proof, click "Continue" to complete
                            your registration
                        </li>
                    </ol>
                </div>

                <div className="flex flex-col space-y-3">
                    <a
                        href={whatsappLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md text-center transition duration-200 flex items-center justify-center"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 mr-2"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                        </svg>
                        Send Payment Proof via WhatsApp
                    </a>
                </div>
            </div>

            {errors && errors.payment_status && (
                <div className="text-red-400 mb-4">{errors.payment_status}</div>
            )}

            <div className="flex justify-between">
                <button
                    type="button"
                    onClick={prevStep}
                    className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded transition duration-200"
                >
                    Previous
                </button>
                <button
                    type="button"
                    onClick={handleContinue}
                    className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition duration-200"
                >
                    Continue to Summary
                </button>
            </div>
        </div>
    );
};

export default PaymentStep;
