export {
  citizenKeys,
  useCitizenProfile,
  useUpdateProfile,
  useCitizenDocuments,
  useCitizenDocument,
  useCitizenVehicles,
  useCitizenHealth,
  useCitizenFamily,
  useCitizenWork,
  useCitizenAppointments,
  useBookAppointment,
  useCitizenNotifications,
} from './useCitizenQueries';

export {
  adminKeys,
  useAdminCitizens,
  useAdminCitizen,
  useUpdateCitizenStatus,
  useAdminAnalytics,
  useAdminActivity,
  useIssueDocument,
} from './useAdminQueries';

export { verifyKeys, useVerifyDocument } from './useVerifyQuery';
