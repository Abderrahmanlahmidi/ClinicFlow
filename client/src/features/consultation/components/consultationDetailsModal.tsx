import React from "react";
import { FiFileText, FiDownload } from "react-icons/fi";
import type { Consultation } from "../types/index";
import {
  formatDate,
  formatTime,
  getPatientName,
  getDoctorName,
} from "../utils";
import { VITAL_SIGNS_LABELS } from "../constants";
import { downloadPDFReport } from "../utils/pdfReport";
interface ConsultationDetailsModalProps {
  consultation: Consultation;
  isDoctor: boolean;
  onClose: () => void;
}

export const ConsultationDetailsModal: React.FC<
  ConsultationDetailsModalProps
> = ({ consultation, isDoctor, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white flex items-center gap-2">
              <FiFileText className="w-6 h-6 text-lime-400" />
              Consultation Details
            </h3>
            <button
              onClick={() => downloadPDFReport(consultation)}
              className="text-gray-400 hover:text-lime-400 transition-colors p-2 hover:bg-gray-800 rounded-lg"
              title="Download Report"
            >
              <FiDownload className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-gray-900 border border-gray-800 rounded-lg">
              <div>
                <p className="text-sm text-gray-400">
                  {isDoctor ? "Patient" : "Doctor"}
                </p>
                <p className="text-lg font-medium text-white">
                  {isDoctor
                    ? getPatientName(consultation)
                    : getDoctorName(consultation)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-400">Date & Time</p>
                <p className="text-white">
                  {formatDate(consultation.consultationDate)} at{" "}
                  {formatTime(consultation.consultationDate)}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-400 mb-2">
                    Consultation Reason
                  </p>
                  <p className="text-white p-3 bg-gray-900 border border-gray-800 rounded-lg">
                    {consultation.consultationReason}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-2">Diagnosis</p>
                  <p className="text-white p-3 bg-gray-900 border border-gray-800 rounded-lg">
                    {consultation.diagnosis}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-2">Doctor's Notes</p>
                  <p className="text-white p-3 bg-gray-900 border border-gray-800 rounded-lg">
                    {consultation.doctorNotes}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-400 mb-2">
                    Medical Information
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-gray-900 border border-gray-800 rounded-lg">
                      <p className="text-xs text-gray-400">Allergies</p>
                      <p className="text-white">{consultation.allergies}</p>
                    </div>
                    <div className="p-3 bg-gray-900 border border-gray-800 rounded-lg">
                      <p className="text-xs text-gray-400">
                        {VITAL_SIGNS_LABELS.bloodType}
                      </p>
                      <p className="text-white">{consultation.bloodType}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-400 mb-2">Vital Signs</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-gray-900 border border-gray-800 rounded-lg">
                      <p className="text-xs text-gray-400">
                        {VITAL_SIGNS_LABELS.weight}
                      </p>
                      <p className="text-white">{consultation.weight} kg</p>
                    </div>
                    <div className="p-3 bg-gray-900 border border-gray-800 rounded-lg">
                      <p className="text-xs text-gray-400">
                        {VITAL_SIGNS_LABELS.height}
                      </p>
                      <p className="text-white">{consultation.height} m</p>
                    </div>
                    <div className="p-3 bg-gray-900 border border-gray-800 rounded-lg">
                      <p className="text-xs text-gray-400">
                        {VITAL_SIGNS_LABELS.bloodPressure}
                      </p>
                      <p className="text-white">{consultation.bloodPressure}</p>
                    </div>
                    <div className="p-3 bg-gray-900 border border-gray-800 rounded-lg">
                      <p className="text-xs text-gray-400">
                        {VITAL_SIGNS_LABELS.temperature}
                      </p>
                      <p className="text-white">
                        {consultation.temperature} °C
                      </p>
                    </div>
                    <div className="p-3 bg-gray-900 border border-gray-800 rounded-lg">
                      <p className="text-xs text-gray-400">
                        {VITAL_SIGNS_LABELS.respiratoryRate}
                      </p>
                      <p className="text-white">
                        {consultation.respiratoryRate}
                      </p>
                    </div>
                    <div className="p-3 bg-gray-900 border border-gray-800 rounded-lg">
                      <p className="text-xs text-gray-400">
                        {VITAL_SIGNS_LABELS.heartRate}
                      </p>
                      <p className="text-white">
                        {consultation.heartRate || consultation.hearRate} bpm
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-800 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-900 border border-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
