import { redirect } from 'next/navigation';

export default function AgencyKeyPage({ params }: { params: { agencyKey: string } }) {
  redirect(`/agency/${params.agencyKey}/dashboard`);
}
